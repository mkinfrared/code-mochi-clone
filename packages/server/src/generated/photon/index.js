"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("./runtime");
/**
 * Query Engine version: latest
 */
const path = require("path");
const debug = runtime_1.debugLib('photon');
class PhotonFetcher {
    constructor(photon, engine, debug = false, hooks) {
        this.photon = photon;
        this.engine = engine;
        this.debug = debug;
        this.hooks = hooks;
    }
    request(document, path = [], rootField, typeName, isList, callsite) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = String(document);
            debug('Request:');
            debug(query);
            if (this.hooks && this.hooks.beforeRequest) {
                this.hooks.beforeRequest({ query, path, rootField, typeName, document });
            }
            try {
                yield this.photon.connect();
                const result = yield this.engine.request(query, typeName);
                debug('Response:');
                debug(result);
                return this.unpack(document, result, path, rootField, isList);
            }
            catch (e) {
                // HACK: This will be removed as soon as the query engine doesn't throw anymore
                if (e.message.includes('Record does not exist') && rootField && rootField.startsWith('findOne')) {
                    return null;
                }
                if (callsite) {
                    const { stack } = runtime_1.printStack({
                        callsite,
                        originalMethod: path.join('.'),
                        onUs: e.isPanic
                    });
                    throw new Error(stack + '\n\n' + e.message);
                }
                else {
                    if (e.isPanic) {
                        throw e;
                    }
                    else {
                        throw new Error(`Error in Photon${path}: \n` + e.stack);
                    }
                }
            }
        });
    }
    unpack(document, data, path, rootField, isList) {
        const getPath = [];
        if (rootField) {
            getPath.push(rootField);
        }
        getPath.push(...path.filter(p => p !== 'select' && p !== 'include'));
        return runtime_1.unpack({ document, path: getPath, data });
    }
}
/**
 * Build tool annotations
 * In order to make `ncc` and `node-file-trace` happy.
**/
path.join(__dirname, 'runtime/query-engine-windows');
class Photon {
    constructor(options = {}) {
        const useDebug = options.debug === true ? true : typeof options.debug === 'object' ? Boolean(options.debug.library) : false;
        if (useDebug) {
            runtime_1.debugLib.enable('photon');
        }
        const debugEngine = options.debug === true ? true : typeof options.debug === 'object' ? Boolean(options.debug.engine) : false;
        // datamodel = datamodel without datasources + printed datasources
        this.datamodel = "generator photon {\r\n  provider = \"photonjs\"\r\n  output = \"../src/generated/photon\"\r\n}\r\n\r\ndatasource db {\r\n  provider = \"postgres\"\r\n  url      = \"postgresql://postgres:1111@localhost:5432/marklar?schema=my_prisma\"\r\n}\r\n\r\nmodel Post {\r\n  id        String   @default(cuid()) @id\r\n  createdAt DateTime @default(now())\r\n  updatedAt DateTime @updatedAt\r\n  published Boolean  @default(true)\r\n  title     String\r\n  content   String?\r\n  author    User?\r\n}\r\n\r\nmodel User {\r\n  id       String  @default(cuid()) @id\r\n  password String\r\n  name     String @unique\r\n  posts    Post[]\r\n}\r\n\r\nmodel Hero {\r\n  id        String @default(cuid()) @id\r\n  heroName  String @unique\r\n  hitpoints Int\r\n}\r\n";
        const predefinedDatasources = [];
        const inputDatasources = Object.entries(options.datasources || {}).map(([name, url]) => ({ name, url: url }));
        const datasources = runtime_1.mergeBy(predefinedDatasources, inputDatasources, (source) => source.name);
        const internal = options.__internal || {};
        const engineConfig = internal.engine || {};
        this.engine = new runtime_1.Engine({
            cwd: engineConfig.cwd || path.resolve(__dirname, "..\\..\\..\\prisma"),
            debug: debugEngine,
            datamodel: this.datamodel,
            prismaPath: engineConfig.binaryPath || undefined,
            datasources,
            generator: { "name": "photon", "provider": "photonjs", "output": "D:\\mkinfrared\\Documents\\Mega\\TypeScript\\code-mochi-clone\\packages\\server\\src\\generated\\photon", "binaryTargets": [], "config": {} },
        });
        this.dmmf = new runtime_1.DMMFClass(exports.dmmf);
        this.fetcher = new PhotonFetcher(this, this.engine, false, internal.hooks);
    }
    connectEngine(publicCall) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.engine.start();
        });
    }
    connect() {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }
        this.connectionPromise = this.connectEngine(true);
        return this.connectionPromise;
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.engine.stop();
        });
    }
    // won't be generated for now
    // private _query?: QueryDelegate
    // get query(): QueryDelegate {
    //   return this._query ? this._query: (this._query = QueryDelegate(this.dmmf, this.fetcher))
    // }
    get posts() {
        return PostDelegate(this.dmmf, this.fetcher);
    }
    get users() {
        return UserDelegate(this.dmmf, this.fetcher);
    }
    get heroes() {
        return HeroDelegate(this.dmmf, this.fetcher);
    }
}
exports.Photon = Photon;
/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }
exports.OrderByArg = makeEnum({
    asc: 'asc',
    desc: 'desc'
});
function PostDelegate(dmmf, fetcher) {
    const Post = (args) => new PostClient(dmmf, fetcher, 'query', 'findManyPost', 'posts', args, []);
    Post.findOne = (args) => args.select ? new PostClient(dmmf, fetcher, 'query', 'findOnePost', 'posts.findOne', args, []) : new PostClient(dmmf, fetcher, 'query', 'findOnePost', 'posts.findOne', args, []);
    Post.findMany = (args) => new PostClient(dmmf, fetcher, 'query', 'findManyPost', 'posts.findMany', args, []);
    Post.create = (args) => args.select ? new PostClient(dmmf, fetcher, 'mutation', 'createOnePost', 'posts.create', args, []) : new PostClient(dmmf, fetcher, 'mutation', 'createOnePost', 'posts.create', args, []);
    Post.delete = (args) => args.select ? new PostClient(dmmf, fetcher, 'mutation', 'deleteOnePost', 'posts.delete', args, []) : new PostClient(dmmf, fetcher, 'mutation', 'deleteOnePost', 'posts.delete', args, []);
    Post.update = (args) => args.select ? new PostClient(dmmf, fetcher, 'mutation', 'updateOnePost', 'posts.update', args, []) : new PostClient(dmmf, fetcher, 'mutation', 'updateOnePost', 'posts.update', args, []);
    Post.deleteMany = (args) => new PostClient(dmmf, fetcher, 'mutation', 'deleteManyPost', 'posts.deleteMany', args, []);
    Post.updateMany = (args) => new PostClient(dmmf, fetcher, 'mutation', 'updateManyPost', 'posts.updateMany', args, []);
    Post.upsert = (args) => args.select ? new PostClient(dmmf, fetcher, 'mutation', 'upsertOnePost', 'posts.upsert', args, []) : new PostClient(dmmf, fetcher, 'mutation', 'upsertOnePost', 'posts.upsert', args, []);
    Post.count = () => new PostClient(dmmf, fetcher, 'query', 'aggregatePost', 'posts.count', {}, ['count']);
    return Post; // any needed until https://github.com/microsoft/TypeScript/issues/31335 is resolved
}
class PostClient {
    constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _path, _isList = false) {
        this._dmmf = _dmmf;
        this._fetcher = _fetcher;
        this._queryType = _queryType;
        this._rootField = _rootField;
        this._clientMethod = _clientMethod;
        this._args = _args;
        this._path = _path;
        this._isList = _isList;
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            const error = new Error();
            if (error && error.stack) {
                const stack = error.stack;
                this._callsite = stack;
            }
        }
    }
    author(args) {
        const prefix = this._path.includes('select') ? 'select' : this._path.includes('include') ? 'include' : 'select';
        const path = [...this._path, prefix, 'author'];
        const newArgs = runtime_1.deepSet(this._args, path, args || true);
        this._isList = false;
        return new UserClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, path, this._isList);
    }
    get _document() {
        const { _rootField: rootField } = this;
        const document = runtime_1.makeDocument({
            dmmf: this._dmmf,
            rootField,
            rootTypeName: this._queryType,
            select: this._args
        });
        try {
            document.validate(this._args, false, this._clientMethod);
        }
        catch (e) {
            const x = e;
            if (x.render) {
                if (this._callsite) {
                    e.message = x.render(this._callsite);
                }
            }
            throw e;
        }
        return runtime_1.transformDocument(document);
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Post', this._isList, this._callsite);
        }
        return this._requestPromise.then(onfulfilled, onrejected);
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Post', this._isList, this._callsite);
        }
        return this._requestPromise.catch(onrejected);
    }
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Post', this._isList, this._callsite);
        }
        return this._requestPromise.finally(onfinally);
    }
}
exports.PostClient = PostClient;
function UserDelegate(dmmf, fetcher) {
    const User = (args) => new UserClient(dmmf, fetcher, 'query', 'findManyUser', 'users', args, []);
    User.findOne = (args) => args.select ? new UserClient(dmmf, fetcher, 'query', 'findOneUser', 'users.findOne', args, []) : new UserClient(dmmf, fetcher, 'query', 'findOneUser', 'users.findOne', args, []);
    User.findMany = (args) => new UserClient(dmmf, fetcher, 'query', 'findManyUser', 'users.findMany', args, []);
    User.create = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'createOneUser', 'users.create', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'createOneUser', 'users.create', args, []);
    User.delete = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'deleteOneUser', 'users.delete', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'deleteOneUser', 'users.delete', args, []);
    User.update = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'updateOneUser', 'users.update', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'updateOneUser', 'users.update', args, []);
    User.deleteMany = (args) => new UserClient(dmmf, fetcher, 'mutation', 'deleteManyUser', 'users.deleteMany', args, []);
    User.updateMany = (args) => new UserClient(dmmf, fetcher, 'mutation', 'updateManyUser', 'users.updateMany', args, []);
    User.upsert = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'upsertOneUser', 'users.upsert', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'upsertOneUser', 'users.upsert', args, []);
    User.count = () => new UserClient(dmmf, fetcher, 'query', 'aggregateUser', 'users.count', {}, ['count']);
    return User; // any needed until https://github.com/microsoft/TypeScript/issues/31335 is resolved
}
class UserClient {
    constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _path, _isList = false) {
        this._dmmf = _dmmf;
        this._fetcher = _fetcher;
        this._queryType = _queryType;
        this._rootField = _rootField;
        this._clientMethod = _clientMethod;
        this._args = _args;
        this._path = _path;
        this._isList = _isList;
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            const error = new Error();
            if (error && error.stack) {
                const stack = error.stack;
                this._callsite = stack;
            }
        }
    }
    posts(args) {
        const prefix = this._path.includes('select') ? 'select' : this._path.includes('include') ? 'include' : 'select';
        const path = [...this._path, prefix, 'posts'];
        const newArgs = runtime_1.deepSet(this._args, path, args || true);
        this._isList = true;
        return new PostClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, path, this._isList);
    }
    get _document() {
        const { _rootField: rootField } = this;
        const document = runtime_1.makeDocument({
            dmmf: this._dmmf,
            rootField,
            rootTypeName: this._queryType,
            select: this._args
        });
        try {
            document.validate(this._args, false, this._clientMethod);
        }
        catch (e) {
            const x = e;
            if (x.render) {
                if (this._callsite) {
                    e.message = x.render(this._callsite);
                }
            }
            throw e;
        }
        return runtime_1.transformDocument(document);
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'User', this._isList, this._callsite);
        }
        return this._requestPromise.then(onfulfilled, onrejected);
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'User', this._isList, this._callsite);
        }
        return this._requestPromise.catch(onrejected);
    }
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'User', this._isList, this._callsite);
        }
        return this._requestPromise.finally(onfinally);
    }
}
exports.UserClient = UserClient;
function HeroDelegate(dmmf, fetcher) {
    const Hero = (args) => new HeroClient(dmmf, fetcher, 'query', 'findManyHero', 'heroes', args, []);
    Hero.findOne = (args) => args.select ? new HeroClient(dmmf, fetcher, 'query', 'findOneHero', 'heroes.findOne', args, []) : new HeroClient(dmmf, fetcher, 'query', 'findOneHero', 'heroes.findOne', args, []);
    Hero.findMany = (args) => new HeroClient(dmmf, fetcher, 'query', 'findManyHero', 'heroes.findMany', args, []);
    Hero.create = (args) => args.select ? new HeroClient(dmmf, fetcher, 'mutation', 'createOneHero', 'heroes.create', args, []) : new HeroClient(dmmf, fetcher, 'mutation', 'createOneHero', 'heroes.create', args, []);
    Hero.delete = (args) => args.select ? new HeroClient(dmmf, fetcher, 'mutation', 'deleteOneHero', 'heroes.delete', args, []) : new HeroClient(dmmf, fetcher, 'mutation', 'deleteOneHero', 'heroes.delete', args, []);
    Hero.update = (args) => args.select ? new HeroClient(dmmf, fetcher, 'mutation', 'updateOneHero', 'heroes.update', args, []) : new HeroClient(dmmf, fetcher, 'mutation', 'updateOneHero', 'heroes.update', args, []);
    Hero.deleteMany = (args) => new HeroClient(dmmf, fetcher, 'mutation', 'deleteManyHero', 'heroes.deleteMany', args, []);
    Hero.updateMany = (args) => new HeroClient(dmmf, fetcher, 'mutation', 'updateManyHero', 'heroes.updateMany', args, []);
    Hero.upsert = (args) => args.select ? new HeroClient(dmmf, fetcher, 'mutation', 'upsertOneHero', 'heroes.upsert', args, []) : new HeroClient(dmmf, fetcher, 'mutation', 'upsertOneHero', 'heroes.upsert', args, []);
    Hero.count = () => new HeroClient(dmmf, fetcher, 'query', 'aggregateHero', 'heroes.count', {}, ['count']);
    return Hero; // any needed until https://github.com/microsoft/TypeScript/issues/31335 is resolved
}
class HeroClient {
    constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _path, _isList = false) {
        this._dmmf = _dmmf;
        this._fetcher = _fetcher;
        this._queryType = _queryType;
        this._rootField = _rootField;
        this._clientMethod = _clientMethod;
        this._args = _args;
        this._path = _path;
        this._isList = _isList;
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            const error = new Error();
            if (error && error.stack) {
                const stack = error.stack;
                this._callsite = stack;
            }
        }
    }
    get _document() {
        const { _rootField: rootField } = this;
        const document = runtime_1.makeDocument({
            dmmf: this._dmmf,
            rootField,
            rootTypeName: this._queryType,
            select: this._args
        });
        try {
            document.validate(this._args, false, this._clientMethod);
        }
        catch (e) {
            const x = e;
            if (x.render) {
                if (this._callsite) {
                    e.message = x.render(this._callsite);
                }
            }
            throw e;
        }
        return runtime_1.transformDocument(document);
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Hero', this._isList, this._callsite);
        }
        return this._requestPromise.then(onfulfilled, onrejected);
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Hero', this._isList, this._callsite);
        }
        return this._requestPromise.catch(onrejected);
    }
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Hero', this._isList, this._callsite);
        }
        return this._requestPromise.finally(onfinally);
    }
}
exports.HeroClient = HeroClient;
/**
 * DMMF
 */
exports.dmmf = { "datamodel": { "enums": [], "models": [{ "name": "Post", "isEmbedded": false, "dbName": null, "fields": [{ "name": "id", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": true, "type": "String", "default": { "name": "cuid", "returnType": "String", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "createdAt", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "DateTime", "default": { "name": "now", "returnType": "DateTime", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "updatedAt", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "DateTime", "isGenerated": false, "isUpdatedAt": true }, { "name": "published", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "Boolean", "default": true, "isGenerated": false, "isUpdatedAt": false }, { "name": "title", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "content", "kind": "scalar", "dbName": null, "isList": false, "isRequired": false, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "author", "kind": "object", "dbName": null, "isList": false, "isRequired": false, "isUnique": false, "isId": false, "type": "User", "relationName": "PostToUser", "relationToFields": ["id"], "relationOnDelete": "NONE", "isGenerated": false, "isUpdatedAt": false }], "isGenerated": false, "idFields": [] }, { "name": "User", "isEmbedded": false, "dbName": null, "fields": [{ "name": "id", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": true, "type": "String", "default": { "name": "cuid", "returnType": "String", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "password", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "name", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "posts", "kind": "object", "dbName": null, "isList": true, "isRequired": false, "isUnique": false, "isId": false, "type": "Post", "relationName": "PostToUser", "relationToFields": [], "relationOnDelete": "NONE", "isGenerated": false, "isUpdatedAt": false }], "isGenerated": false, "idFields": [] }, { "name": "Hero", "isEmbedded": false, "dbName": null, "fields": [{ "name": "id", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": true, "type": "String", "default": { "name": "cuid", "returnType": "String", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "heroName", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "hitpoints", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "Int", "isGenerated": false, "isUpdatedAt": false }], "isGenerated": false, "idFields": [] }] }, "mappings": [{ "model": "Post", "plural": "posts", "findOne": "findOnePost", "findMany": "findManyPost", "create": "createOnePost", "delete": "deleteOnePost", "update": "updateOnePost", "deleteMany": "deleteManyPost", "updateMany": "updateManyPost", "upsert": "upsertOnePost", "aggregate": "aggregatePost" }, { "model": "User", "plural": "users", "findOne": "findOneUser", "findMany": "findManyUser", "create": "createOneUser", "delete": "deleteOneUser", "update": "updateOneUser", "deleteMany": "deleteManyUser", "updateMany": "updateManyUser", "upsert": "upsertOneUser", "aggregate": "aggregateUser" }, { "model": "Hero", "plural": "heroes", "findOne": "findOneHero", "findMany": "findManyHero", "create": "createOneHero", "delete": "deleteOneHero", "update": "updateOneHero", "deleteMany": "deleteManyHero", "updateMany": "updateManyHero", "upsert": "upsertOneHero", "aggregate": "aggregateHero" }], "schema": { "enums": [{ "name": "OrderByArg", "values": ["asc", "desc"] }], "outputTypes": [{ "name": "User", "fields": [{ "name": "id", "args": [], "outputType": { "type": "ID", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "password", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "name", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "posts", "args": [{ "name": "where", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "PostOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": false, "isList": true } }] }, { "name": "Post", "fields": [{ "name": "id", "args": [], "outputType": { "type": "ID", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "createdAt", "args": [], "outputType": { "type": "DateTime", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "updatedAt", "args": [], "outputType": { "type": "DateTime", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "published", "args": [], "outputType": { "type": "Boolean", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "title", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "content", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": false, "isList": false } }, { "name": "author", "args": [], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }] }, { "name": "AggregatePost", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "AggregateUser", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Hero", "fields": [{ "name": "id", "args": [], "outputType": { "type": "ID", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "heroName", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "hitpoints", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "AggregateHero", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Query", "fields": [{ "name": "findManyPost", "args": [{ "name": "where", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "PostOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": false, "isList": true } }, { "name": "aggregatePost", "args": [], "outputType": { "type": "AggregatePost", "kind": "object", "isRequired": true, "isList": false } }, { "name": "findOnePost", "args": [{ "name": "where", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": false, "isList": false } }, { "name": "findManyUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "UserOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": true } }, { "name": "aggregateUser", "args": [], "outputType": { "type": "AggregateUser", "kind": "object", "isRequired": true, "isList": false } }, { "name": "findOneUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }, { "name": "findManyHero", "args": [{ "name": "where", "inputType": [{ "type": "HeroWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "HeroOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "Hero", "kind": "object", "isRequired": false, "isList": true } }, { "name": "aggregateHero", "args": [], "outputType": { "type": "AggregateHero", "kind": "object", "isRequired": true, "isList": false } }, { "name": "findOneHero", "args": [{ "name": "where", "inputType": [{ "type": "HeroWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Hero", "kind": "object", "isRequired": false, "isList": false } }] }, { "name": "BatchPayload", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Mutation", "fields": [{ "name": "createOnePost", "args": [{ "name": "data", "inputType": [{ "type": "PostCreateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteOnePost", "args": [{ "name": "where", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": false, "isList": false } }, { "name": "updateOnePost", "args": [{ "name": "data", "inputType": [{ "type": "PostUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": false, "isList": false } }, { "name": "upsertOnePost", "args": [{ "name": "where", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "PostCreateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "PostUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Post", "kind": "object", "isRequired": true, "isList": false } }, { "name": "updateManyPost", "args": [{ "name": "data", "inputType": [{ "type": "PostUpdateManyMutationInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteManyPost", "args": [{ "name": "where", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "createOneUser", "args": [{ "name": "data", "inputType": [{ "type": "UserCreateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteOneUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }, { "name": "updateOneUser", "args": [{ "name": "data", "inputType": [{ "type": "UserUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }, { "name": "upsertOneUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "UserCreateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "UserUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": true, "isList": false } }, { "name": "updateManyUser", "args": [{ "name": "data", "inputType": [{ "type": "UserUpdateManyMutationInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteManyUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "createOneHero", "args": [{ "name": "data", "inputType": [{ "type": "HeroCreateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Hero", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteOneHero", "args": [{ "name": "where", "inputType": [{ "type": "HeroWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Hero", "kind": "object", "isRequired": false, "isList": false } }, { "name": "updateOneHero", "args": [{ "name": "data", "inputType": [{ "type": "HeroUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "HeroWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Hero", "kind": "object", "isRequired": false, "isList": false } }, { "name": "upsertOneHero", "args": [{ "name": "where", "inputType": [{ "type": "HeroWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "HeroCreateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "HeroUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Hero", "kind": "object", "isRequired": true, "isList": false } }, { "name": "updateManyHero", "args": [{ "name": "data", "inputType": [{ "type": "HeroUpdateManyMutationInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "HeroWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteManyHero", "args": [{ "name": "where", "inputType": [{ "type": "HeroWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }] }], "inputTypes": [{ "name": "UserWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "password", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "name", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "posts", "inputType": [{ "type": "PostFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "PostWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "createdAt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "type": "DateTimeFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "updatedAt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "type": "DateTimeFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "published", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Boolean" }, { "type": "BooleanFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "title", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "content", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "NullableStringFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "PostWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "author", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "PostWhereUniqueInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }], "atLeastOne": true }, { "name": "UserWhereUniqueInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }], "atLeastOne": true }, { "name": "HeroWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "heroName", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "hitpoints", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }, { "type": "IntFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "HeroWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "HeroWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "HeroWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "HeroWhereUniqueInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "heroName", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }], "atLeastOne": true }, { "name": "UserCreateWithoutPostsInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "password", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }] }, { "name": "UserCreateOneWithoutAuthorInput", "fields": [{ "name": "create", "inputType": [{ "type": "UserCreateWithoutPostsInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "connect", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "PostCreateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "published", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "content", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "author", "inputType": [{ "type": "UserCreateOneWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "UserUpdateWithoutPostsDataInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "password", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "UserUpsertWithoutPostsInput", "fields": [{ "name": "update", "inputType": [{ "type": "UserUpdateWithoutPostsDataInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "UserCreateWithoutPostsInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "UserUpdateOneWithoutPostsInput", "fields": [{ "name": "create", "inputType": [{ "type": "UserCreateWithoutPostsInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "connect", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "disconnect", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "delete", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "update", "inputType": [{ "type": "UserUpdateWithoutPostsDataInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "upsert", "inputType": [{ "type": "UserUpsertWithoutPostsInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "PostUpdateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "published", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "content", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "author", "inputType": [{ "type": "UserUpdateOneWithoutPostsInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "PostUpdateManyMutationInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "published", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "content", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "PostCreateWithoutAuthorInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "published", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "content", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "PostCreateManyWithoutPostsInput", "fields": [{ "name": "create", "inputType": [{ "type": "PostCreateWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "connect", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }] }, { "name": "UserCreateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "password", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "posts", "inputType": [{ "type": "PostCreateManyWithoutPostsInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "PostUpdateWithoutAuthorDataInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "published", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "content", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "PostUpdateWithWhereUniqueWithoutAuthorInput", "fields": [{ "name": "where", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "data", "inputType": [{ "type": "PostUpdateWithoutAuthorDataInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "PostScalarWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "createdAt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "type": "DateTimeFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "updatedAt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "type": "DateTimeFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "published", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Boolean" }, { "type": "BooleanFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "title", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "content", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "NullableStringFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "PostScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "PostScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "PostScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "PostUpdateManyDataInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "createdAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "updatedAt", "inputType": [{ "type": "DateTime", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "published", "inputType": [{ "type": "Boolean", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "content", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "PostUpdateManyWithWhereNestedInput", "fields": [{ "name": "where", "inputType": [{ "type": "PostScalarWhereInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "data", "inputType": [{ "type": "PostUpdateManyDataInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "PostUpsertWithWhereUniqueWithoutAuthorInput", "fields": [{ "name": "where", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "PostUpdateWithoutAuthorDataInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "PostCreateWithoutAuthorInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "PostUpdateManyWithoutAuthorInput", "fields": [{ "name": "create", "inputType": [{ "type": "PostCreateWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "connect", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "set", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "disconnect", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "delete", "inputType": [{ "type": "PostWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "update", "inputType": [{ "type": "PostUpdateWithWhereUniqueWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "updateMany", "inputType": [{ "type": "PostUpdateManyWithWhereNestedInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "deleteMany", "inputType": [{ "type": "PostScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "upsert", "inputType": [{ "type": "PostUpsertWithWhereUniqueWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": true }] }] }, { "name": "UserUpdateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "password", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "posts", "inputType": [{ "type": "PostUpdateManyWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "UserUpdateManyMutationInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "password", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "HeroCreateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "heroName", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "hitpoints", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": true, "isList": false }] }] }, { "name": "HeroUpdateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "heroName", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "hitpoints", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "HeroUpdateManyMutationInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "heroName", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "hitpoints", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "StringFilter", "fields": [{ "name": "equals", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "not", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "StringFilter" }] }, { "name": "in", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "notIn", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "contains", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "startsWith", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "endsWith", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }], "atLeastOne": false }, { "name": "PostFilter", "fields": [{ "name": "every", "isRelationFilter": true, "inputType": [{ "isList": false, "isRequired": false, "kind": "object", "type": "PostWhereInput" }] }, { "name": "some", "isRelationFilter": true, "inputType": [{ "isList": false, "isRequired": false, "kind": "object", "type": "PostWhereInput" }] }, { "name": "none", "isRelationFilter": true, "inputType": [{ "isList": false, "isRequired": false, "kind": "object", "type": "PostWhereInput" }] }], "atLeastOne": false }, { "name": "DateTimeFilter", "fields": [{ "name": "equals", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "not", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTimeFilter" }] }, { "name": "in", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "notIn", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "lt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "lte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "gt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }, { "name": "gte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "DateTime" }] }], "atLeastOne": false }, { "name": "BooleanFilter", "fields": [{ "name": "equals", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Boolean" }] }, { "name": "not", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Boolean" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "BooleanFilter" }] }], "atLeastOne": false }, { "name": "NullableStringFilter", "fields": [{ "name": "equals", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "null" }] }, { "name": "not", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "null" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "NullableStringFilter" }] }, { "name": "in", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "notIn", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "contains", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "startsWith", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "endsWith", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }], "atLeastOne": false }, { "name": "IntFilter", "fields": [{ "name": "equals", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "not", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "IntFilter" }] }, { "name": "in", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "notIn", "isRelationFilter": false, "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "lt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "lte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "gt", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "gte", "isRelationFilter": false, "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }], "atLeastOne": false }, { "name": "PostOrderByInput", "atLeastOne": true, "atMostOne": true, "isOrderType": true, "fields": [{ "name": "id", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "createdAt", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "updatedAt", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "published", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "title", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "content", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }] }, { "name": "UserOrderByInput", "atLeastOne": true, "atMostOne": true, "isOrderType": true, "fields": [{ "name": "id", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "password", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "name", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }] }, { "name": "HeroOrderByInput", "atLeastOne": true, "atMostOne": true, "isOrderType": true, "fields": [{ "name": "id", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "heroName", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "hitpoints", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }] }] } };
