import { DMMF, DMMFClass, Engine } from './runtime';
/**
 * Utility Types
 */
export declare type Enumerable<T> = T | Array<T>;
export declare type MergeTruthyValues<R extends object, S extends object> = {
    [key in keyof S | keyof R]: key extends false ? never : key extends keyof S ? S[key] extends false ? never : S[key] : key extends keyof R ? R[key] : never;
};
export declare type CleanupNever<T> = {
    [key in keyof T]: T[key] extends never ? never : key;
}[keyof T];
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export declare type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
declare class PhotonFetcher {
    private readonly photon;
    private readonly engine;
    private readonly debug;
    private readonly hooks?;
    constructor(photon: Photon, engine: Engine, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, path?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
}
/**
 * Client
**/
export declare type Datasources = {
    db?: string;
};
export interface PhotonOptions {
    datasources?: Datasources;
    debug?: boolean | {
        engine?: boolean;
        library?: boolean;
    };
    /**
     * You probably don't want to use this. `__internal` is used by internal tooling.
     */
    __internal?: {
        hooks?: Hooks;
        engine?: {
            cwd?: string;
            binaryPath?: string;
        };
    };
}
export declare type Hooks = {
    beforeRequest?: (options: {
        query: string;
        path: string[];
        rootField?: string;
        typeName?: string;
        document: any;
    }) => any;
};
export declare class Photon {
    private fetcher;
    private readonly dmmf;
    private readonly engine;
    private readonly datamodel;
    private connectionPromise?;
    constructor(options?: PhotonOptions);
    private connectEngine;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    readonly posts: PostDelegate;
    readonly users: UserDelegate;
    readonly heroes: HeroDelegate;
}
export declare const OrderByArg: {
    asc: "asc";
    desc: "desc";
};
export declare type OrderByArg = (typeof OrderByArg)[keyof typeof OrderByArg];
/**
 * Model Post
 */
export declare type Post = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    title: string;
    content: string | null;
};
export declare type PostScalars = 'id' | 'createdAt' | 'updatedAt' | 'published' | 'title' | 'content';
export declare type PostSelect = {
    id?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    published?: boolean;
    title?: boolean;
    content?: boolean;
    author?: boolean | UserSelectArgsOptional;
};
export declare type PostInclude = {
    author?: boolean | UserIncludeArgsOptional;
};
declare type PostDefault = {
    id: true;
    createdAt: true;
    updatedAt: true;
    published: true;
    title: true;
    content: true;
};
declare type PostGetSelectPayload<S extends boolean | PostSelect> = S extends true ? Post : S extends PostSelect ? {
    [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends PostScalars ? Post[P] : P extends 'author' ? UserGetSelectPayload<ExtractUserSelectArgs<S[P]>> | null : never;
} : never;
declare type PostGetIncludePayload<S extends boolean | PostInclude> = S extends true ? Post : S extends PostInclude ? {
    [P in CleanupNever<MergeTruthyValues<PostDefault, S>>]: P extends PostScalars ? Post[P] : P extends 'author' ? UserGetIncludePayload<ExtractUserIncludeArgs<S[P]>> | null : never;
} : never;
export interface PostDelegate {
    <T extends FindManyPostArgs>(args?: Subset<T, FindManyPostArgs>): T extends FindManyPostArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyPostSelectArgs ? Promise<Array<PostGetSelectPayload<ExtractFindManyPostSelectArgs<T>>>> : T extends FindManyPostIncludeArgs ? Promise<Array<PostGetIncludePayload<ExtractFindManyPostIncludeArgs<T>>>> : Promise<Array<Post>>;
    findOne<T extends FindOnePostArgs>(args: Subset<T, FindOnePostArgs>): T extends FindOnePostArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOnePostSelectArgs ? Promise<PostGetSelectPayload<ExtractFindOnePostSelectArgs<T>> | null> : T extends FindOnePostIncludeArgs ? Promise<PostGetIncludePayload<ExtractFindOnePostIncludeArgs<T>> | null> : PostClient<Post | null>;
    findMany<T extends FindManyPostArgs>(args?: Subset<T, FindManyPostArgs>): T extends FindManyPostArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyPostSelectArgs ? Promise<Array<PostGetSelectPayload<ExtractFindManyPostSelectArgs<T>>>> : T extends FindManyPostIncludeArgs ? Promise<Array<PostGetIncludePayload<ExtractFindManyPostIncludeArgs<T>>>> : Promise<Array<Post>>;
    create<T extends PostCreateArgs>(args: Subset<T, PostCreateArgs>): T extends PostCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends PostSelectCreateArgs ? Promise<PostGetSelectPayload<ExtractPostSelectCreateArgs<T>>> : T extends PostIncludeCreateArgs ? Promise<PostGetIncludePayload<ExtractPostIncludeCreateArgs<T>>> : PostClient<Post>;
    delete<T extends PostDeleteArgs>(args: Subset<T, PostDeleteArgs>): T extends PostDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends PostSelectDeleteArgs ? Promise<PostGetSelectPayload<ExtractPostSelectDeleteArgs<T>>> : T extends PostIncludeDeleteArgs ? Promise<PostGetIncludePayload<ExtractPostIncludeDeleteArgs<T>>> : PostClient<Post>;
    update<T extends PostUpdateArgs>(args: Subset<T, PostUpdateArgs>): T extends PostUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends PostSelectUpdateArgs ? Promise<PostGetSelectPayload<ExtractPostSelectUpdateArgs<T>>> : T extends PostIncludeUpdateArgs ? Promise<PostGetIncludePayload<ExtractPostIncludeUpdateArgs<T>>> : PostClient<Post>;
    deleteMany<T extends PostDeleteManyArgs>(args: Subset<T, PostDeleteManyArgs>): Promise<BatchPayload>;
    updateMany<T extends PostUpdateManyArgs>(args: Subset<T, PostUpdateManyArgs>): Promise<BatchPayload>;
    upsert<T extends PostUpsertArgs>(args: Subset<T, PostUpsertArgs>): T extends PostUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends PostSelectUpsertArgs ? Promise<PostGetSelectPayload<ExtractPostSelectUpsertArgs<T>>> : T extends PostIncludeUpsertArgs ? Promise<PostGetIncludePayload<ExtractPostIncludeUpsertArgs<T>>> : PostClient<Post>;
    count(): Promise<number>;
}
export declare class PostClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _path;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: DMMFClass, _fetcher: PhotonFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _path: string[], _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PhotonPromise';
    author<T extends UserArgs = {}>(args?: Subset<T, UserArgs>): T extends FindOneUserArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectArgs ? Promise<UserGetSelectPayload<ExtractUserSelectArgs<T>> | null> : T extends UserIncludeArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeArgs<T>> | null> : UserClient<User | null>;
    private readonly _document;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
/**
 * Post findOne
 */
export declare type FindOnePostArgs = {
    select?: PostSelect | null;
    include?: PostInclude | null;
    where: PostWhereUniqueInput;
};
export declare type FindOnePostArgsRequired = {
    select: PostSelect;
    include: PostInclude;
    where: PostWhereUniqueInput;
};
export declare type FindOnePostSelectArgs = {
    select: PostSelect;
    where: PostWhereUniqueInput;
};
export declare type FindOnePostSelectArgsOptional = {
    select?: PostSelect | null;
    where: PostWhereUniqueInput;
};
export declare type FindOnePostIncludeArgs = {
    include: PostInclude;
    where: PostWhereUniqueInput;
};
export declare type FindOnePostIncludeArgsOptional = {
    include?: PostInclude | null;
    where: PostWhereUniqueInput;
};
export declare type ExtractFindOnePostSelectArgs<S extends undefined | boolean | FindOnePostSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOnePostSelectArgs ? S['select'] : true;
export declare type ExtractFindOnePostIncludeArgs<S extends undefined | boolean | FindOnePostIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOnePostIncludeArgs ? S['include'] : true;
/**
 * Post findMany
 */
export declare type FindManyPostArgs = {
    select?: PostSelect | null;
    include?: PostInclude | null;
    where?: PostWhereInput | null;
    orderBy?: PostOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyPostArgsRequired = {
    select: PostSelect;
    include: PostInclude;
    where?: PostWhereInput | null;
    orderBy?: PostOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyPostSelectArgs = {
    select: PostSelect;
    where?: PostWhereInput | null;
    orderBy?: PostOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyPostSelectArgsOptional = {
    select?: PostSelect | null;
    where?: PostWhereInput | null;
    orderBy?: PostOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyPostIncludeArgs = {
    include: PostInclude;
    where?: PostWhereInput | null;
    orderBy?: PostOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyPostIncludeArgsOptional = {
    include?: PostInclude | null;
    where?: PostWhereInput | null;
    orderBy?: PostOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type ExtractFindManyPostSelectArgs<S extends undefined | boolean | FindManyPostSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyPostSelectArgs ? S['select'] : true;
export declare type ExtractFindManyPostIncludeArgs<S extends undefined | boolean | FindManyPostIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyPostIncludeArgs ? S['include'] : true;
/**
 * Post create
 */
export declare type PostCreateArgs = {
    select?: PostSelect | null;
    include?: PostInclude | null;
    data: PostCreateInput;
};
export declare type PostCreateArgsRequired = {
    select: PostSelect;
    include: PostInclude;
    data: PostCreateInput;
};
export declare type PostSelectCreateArgs = {
    select: PostSelect;
    data: PostCreateInput;
};
export declare type PostSelectCreateArgsOptional = {
    select?: PostSelect | null;
    data: PostCreateInput;
};
export declare type PostIncludeCreateArgs = {
    include: PostInclude;
    data: PostCreateInput;
};
export declare type PostIncludeCreateArgsOptional = {
    include?: PostInclude | null;
    data: PostCreateInput;
};
export declare type ExtractPostSelectCreateArgs<S extends undefined | boolean | PostSelectCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends PostSelectCreateArgs ? S['select'] : true;
export declare type ExtractPostIncludeCreateArgs<S extends undefined | boolean | PostIncludeCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends PostIncludeCreateArgs ? S['include'] : true;
/**
 * Post update
 */
export declare type PostUpdateArgs = {
    select?: PostSelect | null;
    include?: PostInclude | null;
    data: PostUpdateInput;
    where: PostWhereUniqueInput;
};
export declare type PostUpdateArgsRequired = {
    select: PostSelect;
    include: PostInclude;
    data: PostUpdateInput;
    where: PostWhereUniqueInput;
};
export declare type PostSelectUpdateArgs = {
    select: PostSelect;
    data: PostUpdateInput;
    where: PostWhereUniqueInput;
};
export declare type PostSelectUpdateArgsOptional = {
    select?: PostSelect | null;
    data: PostUpdateInput;
    where: PostWhereUniqueInput;
};
export declare type PostIncludeUpdateArgs = {
    include: PostInclude;
    data: PostUpdateInput;
    where: PostWhereUniqueInput;
};
export declare type PostIncludeUpdateArgsOptional = {
    include?: PostInclude | null;
    data: PostUpdateInput;
    where: PostWhereUniqueInput;
};
export declare type ExtractPostSelectUpdateArgs<S extends undefined | boolean | PostSelectUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends PostSelectUpdateArgs ? S['select'] : true;
export declare type ExtractPostIncludeUpdateArgs<S extends undefined | boolean | PostIncludeUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends PostIncludeUpdateArgs ? S['include'] : true;
/**
 * Post updateMany
 */
export declare type PostUpdateManyArgs = {
    data: PostUpdateManyMutationInput;
    where?: PostWhereInput | null;
};
/**
 * Post upsert
 */
export declare type PostUpsertArgs = {
    select?: PostSelect | null;
    include?: PostInclude | null;
    where: PostWhereUniqueInput;
    create: PostCreateInput;
    update: PostUpdateInput;
};
export declare type PostUpsertArgsRequired = {
    select: PostSelect;
    include: PostInclude;
    where: PostWhereUniqueInput;
    create: PostCreateInput;
    update: PostUpdateInput;
};
export declare type PostSelectUpsertArgs = {
    select: PostSelect;
    where: PostWhereUniqueInput;
    create: PostCreateInput;
    update: PostUpdateInput;
};
export declare type PostSelectUpsertArgsOptional = {
    select?: PostSelect | null;
    where: PostWhereUniqueInput;
    create: PostCreateInput;
    update: PostUpdateInput;
};
export declare type PostIncludeUpsertArgs = {
    include: PostInclude;
    where: PostWhereUniqueInput;
    create: PostCreateInput;
    update: PostUpdateInput;
};
export declare type PostIncludeUpsertArgsOptional = {
    include?: PostInclude | null;
    where: PostWhereUniqueInput;
    create: PostCreateInput;
    update: PostUpdateInput;
};
export declare type ExtractPostSelectUpsertArgs<S extends undefined | boolean | PostSelectUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends PostSelectUpsertArgs ? S['select'] : true;
export declare type ExtractPostIncludeUpsertArgs<S extends undefined | boolean | PostIncludeUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends PostIncludeUpsertArgs ? S['include'] : true;
/**
 * Post delete
 */
export declare type PostDeleteArgs = {
    select?: PostSelect | null;
    include?: PostInclude | null;
    where: PostWhereUniqueInput;
};
export declare type PostDeleteArgsRequired = {
    select: PostSelect;
    include: PostInclude;
    where: PostWhereUniqueInput;
};
export declare type PostSelectDeleteArgs = {
    select: PostSelect;
    where: PostWhereUniqueInput;
};
export declare type PostSelectDeleteArgsOptional = {
    select?: PostSelect | null;
    where: PostWhereUniqueInput;
};
export declare type PostIncludeDeleteArgs = {
    include: PostInclude;
    where: PostWhereUniqueInput;
};
export declare type PostIncludeDeleteArgsOptional = {
    include?: PostInclude | null;
    where: PostWhereUniqueInput;
};
export declare type ExtractPostSelectDeleteArgs<S extends undefined | boolean | PostSelectDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends PostSelectDeleteArgs ? S['select'] : true;
export declare type ExtractPostIncludeDeleteArgs<S extends undefined | boolean | PostIncludeDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends PostIncludeDeleteArgs ? S['include'] : true;
/**
 * Post deleteMany
 */
export declare type PostDeleteManyArgs = {
    where?: PostWhereInput | null;
};
/**
 * Post without action
 */
export declare type PostArgs = {
    select?: PostSelect | null;
    include?: PostInclude | null;
};
export declare type PostArgsRequired = {
    select: PostSelect;
    include: PostInclude;
};
export declare type PostSelectArgs = {
    select: PostSelect;
};
export declare type PostSelectArgsOptional = {
    select?: PostSelect | null;
};
export declare type PostIncludeArgs = {
    include: PostInclude;
};
export declare type PostIncludeArgsOptional = {
    include?: PostInclude | null;
};
export declare type ExtractPostSelectArgs<S extends undefined | boolean | PostSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends PostSelectArgs ? S['select'] : true;
export declare type ExtractPostIncludeArgs<S extends undefined | boolean | PostIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends PostIncludeArgs ? S['include'] : true;
/**
 * Model User
 */
export declare type User = {
    id: string;
    password: string;
    name: string;
};
export declare type UserScalars = 'id' | 'password' | 'name';
export declare type UserSelect = {
    id?: boolean;
    password?: boolean;
    name?: boolean;
    posts?: boolean | FindManyPostSelectArgsOptional;
};
export declare type UserInclude = {
    posts?: boolean | FindManyPostIncludeArgsOptional;
};
declare type UserDefault = {
    id: true;
    password: true;
    name: true;
};
declare type UserGetSelectPayload<S extends boolean | UserSelect> = S extends true ? User : S extends UserSelect ? {
    [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends UserScalars ? User[P] : P extends 'posts' ? Array<PostGetSelectPayload<ExtractFindManyPostSelectArgs<S[P]>> | null> : never;
} : never;
declare type UserGetIncludePayload<S extends boolean | UserInclude> = S extends true ? User : S extends UserInclude ? {
    [P in CleanupNever<MergeTruthyValues<UserDefault, S>>]: P extends UserScalars ? User[P] : P extends 'posts' ? Array<PostGetIncludePayload<ExtractFindManyPostIncludeArgs<S[P]>> | null> : never;
} : never;
export interface UserDelegate {
    <T extends FindManyUserArgs>(args?: Subset<T, FindManyUserArgs>): T extends FindManyUserArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyUserSelectArgs ? Promise<Array<UserGetSelectPayload<ExtractFindManyUserSelectArgs<T>>>> : T extends FindManyUserIncludeArgs ? Promise<Array<UserGetIncludePayload<ExtractFindManyUserIncludeArgs<T>>>> : Promise<Array<User>>;
    findOne<T extends FindOneUserArgs>(args: Subset<T, FindOneUserArgs>): T extends FindOneUserArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneUserSelectArgs ? Promise<UserGetSelectPayload<ExtractFindOneUserSelectArgs<T>> | null> : T extends FindOneUserIncludeArgs ? Promise<UserGetIncludePayload<ExtractFindOneUserIncludeArgs<T>> | null> : UserClient<User | null>;
    findMany<T extends FindManyUserArgs>(args?: Subset<T, FindManyUserArgs>): T extends FindManyUserArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyUserSelectArgs ? Promise<Array<UserGetSelectPayload<ExtractFindManyUserSelectArgs<T>>>> : T extends FindManyUserIncludeArgs ? Promise<Array<UserGetIncludePayload<ExtractFindManyUserIncludeArgs<T>>>> : Promise<Array<User>>;
    create<T extends UserCreateArgs>(args: Subset<T, UserCreateArgs>): T extends UserCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectCreateArgs ? Promise<UserGetSelectPayload<ExtractUserSelectCreateArgs<T>>> : T extends UserIncludeCreateArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeCreateArgs<T>>> : UserClient<User>;
    delete<T extends UserDeleteArgs>(args: Subset<T, UserDeleteArgs>): T extends UserDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectDeleteArgs ? Promise<UserGetSelectPayload<ExtractUserSelectDeleteArgs<T>>> : T extends UserIncludeDeleteArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeDeleteArgs<T>>> : UserClient<User>;
    update<T extends UserUpdateArgs>(args: Subset<T, UserUpdateArgs>): T extends UserUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectUpdateArgs ? Promise<UserGetSelectPayload<ExtractUserSelectUpdateArgs<T>>> : T extends UserIncludeUpdateArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeUpdateArgs<T>>> : UserClient<User>;
    deleteMany<T extends UserDeleteManyArgs>(args: Subset<T, UserDeleteManyArgs>): Promise<BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Subset<T, UserUpdateManyArgs>): Promise<BatchPayload>;
    upsert<T extends UserUpsertArgs>(args: Subset<T, UserUpsertArgs>): T extends UserUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectUpsertArgs ? Promise<UserGetSelectPayload<ExtractUserSelectUpsertArgs<T>>> : T extends UserIncludeUpsertArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeUpsertArgs<T>>> : UserClient<User>;
    count(): Promise<number>;
}
export declare class UserClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _path;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: DMMFClass, _fetcher: PhotonFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _path: string[], _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PhotonPromise';
    posts<T extends FindManyPostArgs = {}>(args?: Subset<T, FindManyPostArgs>): T extends FindManyPostArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyPostSelectArgs ? Promise<Array<PostGetSelectPayload<ExtractFindManyPostSelectArgs<T>>>> : T extends FindManyPostIncludeArgs ? Promise<Array<PostGetIncludePayload<ExtractFindManyPostIncludeArgs<T>>>> : Promise<Array<Post>>;
    private readonly _document;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
/**
 * User findOne
 */
export declare type FindOneUserArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
    where: UserWhereUniqueInput;
};
export declare type FindOneUserArgsRequired = {
    select: UserSelect;
    include: UserInclude;
    where: UserWhereUniqueInput;
};
export declare type FindOneUserSelectArgs = {
    select: UserSelect;
    where: UserWhereUniqueInput;
};
export declare type FindOneUserSelectArgsOptional = {
    select?: UserSelect | null;
    where: UserWhereUniqueInput;
};
export declare type FindOneUserIncludeArgs = {
    include: UserInclude;
    where: UserWhereUniqueInput;
};
export declare type FindOneUserIncludeArgsOptional = {
    include?: UserInclude | null;
    where: UserWhereUniqueInput;
};
export declare type ExtractFindOneUserSelectArgs<S extends undefined | boolean | FindOneUserSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneUserSelectArgs ? S['select'] : true;
export declare type ExtractFindOneUserIncludeArgs<S extends undefined | boolean | FindOneUserIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneUserIncludeArgs ? S['include'] : true;
/**
 * User findMany
 */
export declare type FindManyUserArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyUserArgsRequired = {
    select: UserSelect;
    include: UserInclude;
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyUserSelectArgs = {
    select: UserSelect;
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyUserSelectArgsOptional = {
    select?: UserSelect | null;
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyUserIncludeArgs = {
    include: UserInclude;
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyUserIncludeArgsOptional = {
    include?: UserInclude | null;
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type ExtractFindManyUserSelectArgs<S extends undefined | boolean | FindManyUserSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyUserSelectArgs ? S['select'] : true;
export declare type ExtractFindManyUserIncludeArgs<S extends undefined | boolean | FindManyUserIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyUserIncludeArgs ? S['include'] : true;
/**
 * User create
 */
export declare type UserCreateArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
    data: UserCreateInput;
};
export declare type UserCreateArgsRequired = {
    select: UserSelect;
    include: UserInclude;
    data: UserCreateInput;
};
export declare type UserSelectCreateArgs = {
    select: UserSelect;
    data: UserCreateInput;
};
export declare type UserSelectCreateArgsOptional = {
    select?: UserSelect | null;
    data: UserCreateInput;
};
export declare type UserIncludeCreateArgs = {
    include: UserInclude;
    data: UserCreateInput;
};
export declare type UserIncludeCreateArgsOptional = {
    include?: UserInclude | null;
    data: UserCreateInput;
};
export declare type ExtractUserSelectCreateArgs<S extends undefined | boolean | UserSelectCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserSelectCreateArgs ? S['select'] : true;
export declare type ExtractUserIncludeCreateArgs<S extends undefined | boolean | UserIncludeCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserIncludeCreateArgs ? S['include'] : true;
/**
 * User update
 */
export declare type UserUpdateArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type UserUpdateArgsRequired = {
    select: UserSelect;
    include: UserInclude;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type UserSelectUpdateArgs = {
    select: UserSelect;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type UserSelectUpdateArgsOptional = {
    select?: UserSelect | null;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type UserIncludeUpdateArgs = {
    include: UserInclude;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type UserIncludeUpdateArgsOptional = {
    include?: UserInclude | null;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type ExtractUserSelectUpdateArgs<S extends undefined | boolean | UserSelectUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserSelectUpdateArgs ? S['select'] : true;
export declare type ExtractUserIncludeUpdateArgs<S extends undefined | boolean | UserIncludeUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserIncludeUpdateArgs ? S['include'] : true;
/**
 * User updateMany
 */
export declare type UserUpdateManyArgs = {
    data: UserUpdateManyMutationInput;
    where?: UserWhereInput | null;
};
/**
 * User upsert
 */
export declare type UserUpsertArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type UserUpsertArgsRequired = {
    select: UserSelect;
    include: UserInclude;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type UserSelectUpsertArgs = {
    select: UserSelect;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type UserSelectUpsertArgsOptional = {
    select?: UserSelect | null;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type UserIncludeUpsertArgs = {
    include: UserInclude;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type UserIncludeUpsertArgsOptional = {
    include?: UserInclude | null;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type ExtractUserSelectUpsertArgs<S extends undefined | boolean | UserSelectUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserSelectUpsertArgs ? S['select'] : true;
export declare type ExtractUserIncludeUpsertArgs<S extends undefined | boolean | UserIncludeUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserIncludeUpsertArgs ? S['include'] : true;
/**
 * User delete
 */
export declare type UserDeleteArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
    where: UserWhereUniqueInput;
};
export declare type UserDeleteArgsRequired = {
    select: UserSelect;
    include: UserInclude;
    where: UserWhereUniqueInput;
};
export declare type UserSelectDeleteArgs = {
    select: UserSelect;
    where: UserWhereUniqueInput;
};
export declare type UserSelectDeleteArgsOptional = {
    select?: UserSelect | null;
    where: UserWhereUniqueInput;
};
export declare type UserIncludeDeleteArgs = {
    include: UserInclude;
    where: UserWhereUniqueInput;
};
export declare type UserIncludeDeleteArgsOptional = {
    include?: UserInclude | null;
    where: UserWhereUniqueInput;
};
export declare type ExtractUserSelectDeleteArgs<S extends undefined | boolean | UserSelectDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserSelectDeleteArgs ? S['select'] : true;
export declare type ExtractUserIncludeDeleteArgs<S extends undefined | boolean | UserIncludeDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserIncludeDeleteArgs ? S['include'] : true;
/**
 * User deleteMany
 */
export declare type UserDeleteManyArgs = {
    where?: UserWhereInput | null;
};
/**
 * User without action
 */
export declare type UserArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
};
export declare type UserArgsRequired = {
    select: UserSelect;
    include: UserInclude;
};
export declare type UserSelectArgs = {
    select: UserSelect;
};
export declare type UserSelectArgsOptional = {
    select?: UserSelect | null;
};
export declare type UserIncludeArgs = {
    include: UserInclude;
};
export declare type UserIncludeArgsOptional = {
    include?: UserInclude | null;
};
export declare type ExtractUserSelectArgs<S extends undefined | boolean | UserSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserSelectArgs ? S['select'] : true;
export declare type ExtractUserIncludeArgs<S extends undefined | boolean | UserIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserIncludeArgs ? S['include'] : true;
/**
 * Model Hero
 */
export declare type Hero = {
    id: string;
    heroName: string;
    hitpoints: number;
};
export declare type HeroScalars = 'id' | 'heroName' | 'hitpoints';
export declare type HeroSelect = {
    id?: boolean;
    heroName?: boolean;
    hitpoints?: boolean;
};
export declare type HeroInclude = {};
declare type HeroDefault = {
    id: true;
    heroName: true;
    hitpoints: true;
};
declare type HeroGetSelectPayload<S extends boolean | HeroSelect> = S extends true ? Hero : S extends HeroSelect ? {
    [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends HeroScalars ? Hero[P] : never;
} : never;
declare type HeroGetIncludePayload<S extends boolean | HeroInclude> = S extends true ? Hero : S extends HeroInclude ? {
    [P in CleanupNever<MergeTruthyValues<HeroDefault, S>>]: P extends HeroScalars ? Hero[P] : never;
} : never;
export interface HeroDelegate {
    <T extends FindManyHeroArgs>(args?: Subset<T, FindManyHeroArgs>): T extends FindManyHeroArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyHeroSelectArgs ? Promise<Array<HeroGetSelectPayload<ExtractFindManyHeroSelectArgs<T>>>> : T extends FindManyHeroIncludeArgs ? Promise<Array<HeroGetIncludePayload<ExtractFindManyHeroIncludeArgs<T>>>> : Promise<Array<Hero>>;
    findOne<T extends FindOneHeroArgs>(args: Subset<T, FindOneHeroArgs>): T extends FindOneHeroArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneHeroSelectArgs ? Promise<HeroGetSelectPayload<ExtractFindOneHeroSelectArgs<T>> | null> : T extends FindOneHeroIncludeArgs ? Promise<HeroGetIncludePayload<ExtractFindOneHeroIncludeArgs<T>> | null> : HeroClient<Hero | null>;
    findMany<T extends FindManyHeroArgs>(args?: Subset<T, FindManyHeroArgs>): T extends FindManyHeroArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyHeroSelectArgs ? Promise<Array<HeroGetSelectPayload<ExtractFindManyHeroSelectArgs<T>>>> : T extends FindManyHeroIncludeArgs ? Promise<Array<HeroGetIncludePayload<ExtractFindManyHeroIncludeArgs<T>>>> : Promise<Array<Hero>>;
    create<T extends HeroCreateArgs>(args: Subset<T, HeroCreateArgs>): T extends HeroCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends HeroSelectCreateArgs ? Promise<HeroGetSelectPayload<ExtractHeroSelectCreateArgs<T>>> : T extends HeroIncludeCreateArgs ? Promise<HeroGetIncludePayload<ExtractHeroIncludeCreateArgs<T>>> : HeroClient<Hero>;
    delete<T extends HeroDeleteArgs>(args: Subset<T, HeroDeleteArgs>): T extends HeroDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends HeroSelectDeleteArgs ? Promise<HeroGetSelectPayload<ExtractHeroSelectDeleteArgs<T>>> : T extends HeroIncludeDeleteArgs ? Promise<HeroGetIncludePayload<ExtractHeroIncludeDeleteArgs<T>>> : HeroClient<Hero>;
    update<T extends HeroUpdateArgs>(args: Subset<T, HeroUpdateArgs>): T extends HeroUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends HeroSelectUpdateArgs ? Promise<HeroGetSelectPayload<ExtractHeroSelectUpdateArgs<T>>> : T extends HeroIncludeUpdateArgs ? Promise<HeroGetIncludePayload<ExtractHeroIncludeUpdateArgs<T>>> : HeroClient<Hero>;
    deleteMany<T extends HeroDeleteManyArgs>(args: Subset<T, HeroDeleteManyArgs>): Promise<BatchPayload>;
    updateMany<T extends HeroUpdateManyArgs>(args: Subset<T, HeroUpdateManyArgs>): Promise<BatchPayload>;
    upsert<T extends HeroUpsertArgs>(args: Subset<T, HeroUpsertArgs>): T extends HeroUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends HeroSelectUpsertArgs ? Promise<HeroGetSelectPayload<ExtractHeroSelectUpsertArgs<T>>> : T extends HeroIncludeUpsertArgs ? Promise<HeroGetIncludePayload<ExtractHeroIncludeUpsertArgs<T>>> : HeroClient<Hero>;
    count(): Promise<number>;
}
export declare class HeroClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _path;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: DMMFClass, _fetcher: PhotonFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _path: string[], _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PhotonPromise';
    private readonly _document;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
/**
 * Hero findOne
 */
export declare type FindOneHeroArgs = {
    select?: HeroSelect | null;
    include?: HeroInclude | null;
    where: HeroWhereUniqueInput;
};
export declare type FindOneHeroArgsRequired = {
    select: HeroSelect;
    include: HeroInclude;
    where: HeroWhereUniqueInput;
};
export declare type FindOneHeroSelectArgs = {
    select: HeroSelect;
    where: HeroWhereUniqueInput;
};
export declare type FindOneHeroSelectArgsOptional = {
    select?: HeroSelect | null;
    where: HeroWhereUniqueInput;
};
export declare type FindOneHeroIncludeArgs = {
    include: HeroInclude;
    where: HeroWhereUniqueInput;
};
export declare type FindOneHeroIncludeArgsOptional = {
    include?: HeroInclude | null;
    where: HeroWhereUniqueInput;
};
export declare type ExtractFindOneHeroSelectArgs<S extends undefined | boolean | FindOneHeroSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneHeroSelectArgs ? S['select'] : true;
export declare type ExtractFindOneHeroIncludeArgs<S extends undefined | boolean | FindOneHeroIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneHeroIncludeArgs ? S['include'] : true;
/**
 * Hero findMany
 */
export declare type FindManyHeroArgs = {
    select?: HeroSelect | null;
    include?: HeroInclude | null;
    where?: HeroWhereInput | null;
    orderBy?: HeroOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyHeroArgsRequired = {
    select: HeroSelect;
    include: HeroInclude;
    where?: HeroWhereInput | null;
    orderBy?: HeroOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyHeroSelectArgs = {
    select: HeroSelect;
    where?: HeroWhereInput | null;
    orderBy?: HeroOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyHeroSelectArgsOptional = {
    select?: HeroSelect | null;
    where?: HeroWhereInput | null;
    orderBy?: HeroOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyHeroIncludeArgs = {
    include: HeroInclude;
    where?: HeroWhereInput | null;
    orderBy?: HeroOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyHeroIncludeArgsOptional = {
    include?: HeroInclude | null;
    where?: HeroWhereInput | null;
    orderBy?: HeroOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type ExtractFindManyHeroSelectArgs<S extends undefined | boolean | FindManyHeroSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyHeroSelectArgs ? S['select'] : true;
export declare type ExtractFindManyHeroIncludeArgs<S extends undefined | boolean | FindManyHeroIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyHeroIncludeArgs ? S['include'] : true;
/**
 * Hero create
 */
export declare type HeroCreateArgs = {
    select?: HeroSelect | null;
    include?: HeroInclude | null;
    data: HeroCreateInput;
};
export declare type HeroCreateArgsRequired = {
    select: HeroSelect;
    include: HeroInclude;
    data: HeroCreateInput;
};
export declare type HeroSelectCreateArgs = {
    select: HeroSelect;
    data: HeroCreateInput;
};
export declare type HeroSelectCreateArgsOptional = {
    select?: HeroSelect | null;
    data: HeroCreateInput;
};
export declare type HeroIncludeCreateArgs = {
    include: HeroInclude;
    data: HeroCreateInput;
};
export declare type HeroIncludeCreateArgsOptional = {
    include?: HeroInclude | null;
    data: HeroCreateInput;
};
export declare type ExtractHeroSelectCreateArgs<S extends undefined | boolean | HeroSelectCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends HeroSelectCreateArgs ? S['select'] : true;
export declare type ExtractHeroIncludeCreateArgs<S extends undefined | boolean | HeroIncludeCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends HeroIncludeCreateArgs ? S['include'] : true;
/**
 * Hero update
 */
export declare type HeroUpdateArgs = {
    select?: HeroSelect | null;
    include?: HeroInclude | null;
    data: HeroUpdateInput;
    where: HeroWhereUniqueInput;
};
export declare type HeroUpdateArgsRequired = {
    select: HeroSelect;
    include: HeroInclude;
    data: HeroUpdateInput;
    where: HeroWhereUniqueInput;
};
export declare type HeroSelectUpdateArgs = {
    select: HeroSelect;
    data: HeroUpdateInput;
    where: HeroWhereUniqueInput;
};
export declare type HeroSelectUpdateArgsOptional = {
    select?: HeroSelect | null;
    data: HeroUpdateInput;
    where: HeroWhereUniqueInput;
};
export declare type HeroIncludeUpdateArgs = {
    include: HeroInclude;
    data: HeroUpdateInput;
    where: HeroWhereUniqueInput;
};
export declare type HeroIncludeUpdateArgsOptional = {
    include?: HeroInclude | null;
    data: HeroUpdateInput;
    where: HeroWhereUniqueInput;
};
export declare type ExtractHeroSelectUpdateArgs<S extends undefined | boolean | HeroSelectUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends HeroSelectUpdateArgs ? S['select'] : true;
export declare type ExtractHeroIncludeUpdateArgs<S extends undefined | boolean | HeroIncludeUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends HeroIncludeUpdateArgs ? S['include'] : true;
/**
 * Hero updateMany
 */
export declare type HeroUpdateManyArgs = {
    data: HeroUpdateManyMutationInput;
    where?: HeroWhereInput | null;
};
/**
 * Hero upsert
 */
export declare type HeroUpsertArgs = {
    select?: HeroSelect | null;
    include?: HeroInclude | null;
    where: HeroWhereUniqueInput;
    create: HeroCreateInput;
    update: HeroUpdateInput;
};
export declare type HeroUpsertArgsRequired = {
    select: HeroSelect;
    include: HeroInclude;
    where: HeroWhereUniqueInput;
    create: HeroCreateInput;
    update: HeroUpdateInput;
};
export declare type HeroSelectUpsertArgs = {
    select: HeroSelect;
    where: HeroWhereUniqueInput;
    create: HeroCreateInput;
    update: HeroUpdateInput;
};
export declare type HeroSelectUpsertArgsOptional = {
    select?: HeroSelect | null;
    where: HeroWhereUniqueInput;
    create: HeroCreateInput;
    update: HeroUpdateInput;
};
export declare type HeroIncludeUpsertArgs = {
    include: HeroInclude;
    where: HeroWhereUniqueInput;
    create: HeroCreateInput;
    update: HeroUpdateInput;
};
export declare type HeroIncludeUpsertArgsOptional = {
    include?: HeroInclude | null;
    where: HeroWhereUniqueInput;
    create: HeroCreateInput;
    update: HeroUpdateInput;
};
export declare type ExtractHeroSelectUpsertArgs<S extends undefined | boolean | HeroSelectUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends HeroSelectUpsertArgs ? S['select'] : true;
export declare type ExtractHeroIncludeUpsertArgs<S extends undefined | boolean | HeroIncludeUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends HeroIncludeUpsertArgs ? S['include'] : true;
/**
 * Hero delete
 */
export declare type HeroDeleteArgs = {
    select?: HeroSelect | null;
    include?: HeroInclude | null;
    where: HeroWhereUniqueInput;
};
export declare type HeroDeleteArgsRequired = {
    select: HeroSelect;
    include: HeroInclude;
    where: HeroWhereUniqueInput;
};
export declare type HeroSelectDeleteArgs = {
    select: HeroSelect;
    where: HeroWhereUniqueInput;
};
export declare type HeroSelectDeleteArgsOptional = {
    select?: HeroSelect | null;
    where: HeroWhereUniqueInput;
};
export declare type HeroIncludeDeleteArgs = {
    include: HeroInclude;
    where: HeroWhereUniqueInput;
};
export declare type HeroIncludeDeleteArgsOptional = {
    include?: HeroInclude | null;
    where: HeroWhereUniqueInput;
};
export declare type ExtractHeroSelectDeleteArgs<S extends undefined | boolean | HeroSelectDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends HeroSelectDeleteArgs ? S['select'] : true;
export declare type ExtractHeroIncludeDeleteArgs<S extends undefined | boolean | HeroIncludeDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends HeroIncludeDeleteArgs ? S['include'] : true;
/**
 * Hero deleteMany
 */
export declare type HeroDeleteManyArgs = {
    where?: HeroWhereInput | null;
};
/**
 * Hero without action
 */
export declare type HeroArgs = {
    select?: HeroSelect | null;
    include?: HeroInclude | null;
};
export declare type HeroArgsRequired = {
    select: HeroSelect;
    include: HeroInclude;
};
export declare type HeroSelectArgs = {
    select: HeroSelect;
};
export declare type HeroSelectArgsOptional = {
    select?: HeroSelect | null;
};
export declare type HeroIncludeArgs = {
    include: HeroInclude;
};
export declare type HeroIncludeArgsOptional = {
    include?: HeroInclude | null;
};
export declare type ExtractHeroSelectArgs<S extends undefined | boolean | HeroSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends HeroSelectArgs ? S['select'] : true;
export declare type ExtractHeroIncludeArgs<S extends undefined | boolean | HeroIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends HeroIncludeArgs ? S['include'] : true;
/**
 * Deep Input Types
 */
export declare type UserWhereInput = {
    id?: string | StringFilter | null;
    password?: string | StringFilter | null;
    name?: string | StringFilter | null;
    posts?: PostFilter | null;
    AND?: Enumerable<UserWhereInput> | null;
    OR?: Enumerable<UserWhereInput> | null;
    NOT?: Enumerable<UserWhereInput> | null;
};
export declare type PostWhereInput = {
    id?: string | StringFilter | null;
    createdAt?: Date | string | DateTimeFilter | null;
    updatedAt?: Date | string | DateTimeFilter | null;
    published?: boolean | BooleanFilter | null;
    title?: string | StringFilter | null;
    content?: string | NullableStringFilter | null | null;
    AND?: Enumerable<PostWhereInput> | null;
    OR?: Enumerable<PostWhereInput> | null;
    NOT?: Enumerable<PostWhereInput> | null;
    author?: UserWhereInput | null;
};
export declare type PostWhereUniqueInput = {
    id?: string | null;
};
export declare type UserWhereUniqueInput = {
    id?: string | null;
    name?: string | null;
};
export declare type HeroWhereInput = {
    id?: string | StringFilter | null;
    heroName?: string | StringFilter | null;
    hitpoints?: number | IntFilter | null;
    AND?: Enumerable<HeroWhereInput> | null;
    OR?: Enumerable<HeroWhereInput> | null;
    NOT?: Enumerable<HeroWhereInput> | null;
};
export declare type HeroWhereUniqueInput = {
    id?: string | null;
    heroName?: string | null;
};
export declare type UserCreateWithoutPostsInput = {
    id?: string | null;
    password: string;
    name: string;
};
export declare type UserCreateOneWithoutAuthorInput = {
    create?: UserCreateWithoutPostsInput | null;
    connect?: UserWhereUniqueInput | null;
};
export declare type PostCreateInput = {
    id?: string | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    published?: boolean | null;
    title: string;
    content?: string | null;
    author?: UserCreateOneWithoutAuthorInput | null;
};
export declare type UserUpdateWithoutPostsDataInput = {
    id?: string | null;
    password?: string | null;
    name?: string | null;
};
export declare type UserUpsertWithoutPostsInput = {
    update: UserUpdateWithoutPostsDataInput;
    create: UserCreateWithoutPostsInput;
};
export declare type UserUpdateOneWithoutPostsInput = {
    create?: UserCreateWithoutPostsInput | null;
    connect?: UserWhereUniqueInput | null;
    disconnect?: boolean | null;
    delete?: boolean | null;
    update?: UserUpdateWithoutPostsDataInput | null;
    upsert?: UserUpsertWithoutPostsInput | null;
};
export declare type PostUpdateInput = {
    id?: string | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    published?: boolean | null;
    title?: string | null;
    content?: string | null;
    author?: UserUpdateOneWithoutPostsInput | null;
};
export declare type PostUpdateManyMutationInput = {
    id?: string | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    published?: boolean | null;
    title?: string | null;
    content?: string | null;
};
export declare type PostCreateWithoutAuthorInput = {
    id?: string | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    published?: boolean | null;
    title: string;
    content?: string | null;
};
export declare type PostCreateManyWithoutPostsInput = {
    create?: Enumerable<PostCreateWithoutAuthorInput> | null;
    connect?: Enumerable<PostWhereUniqueInput> | null;
};
export declare type UserCreateInput = {
    id?: string | null;
    password: string;
    name: string;
    posts?: PostCreateManyWithoutPostsInput | null;
};
export declare type PostUpdateWithoutAuthorDataInput = {
    id?: string | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    published?: boolean | null;
    title?: string | null;
    content?: string | null;
};
export declare type PostUpdateWithWhereUniqueWithoutAuthorInput = {
    where: PostWhereUniqueInput;
    data: PostUpdateWithoutAuthorDataInput;
};
export declare type PostScalarWhereInput = {
    id?: string | StringFilter | null;
    createdAt?: Date | string | DateTimeFilter | null;
    updatedAt?: Date | string | DateTimeFilter | null;
    published?: boolean | BooleanFilter | null;
    title?: string | StringFilter | null;
    content?: string | NullableStringFilter | null | null;
    AND?: Enumerable<PostScalarWhereInput> | null;
    OR?: Enumerable<PostScalarWhereInput> | null;
    NOT?: Enumerable<PostScalarWhereInput> | null;
};
export declare type PostUpdateManyDataInput = {
    id?: string | null;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    published?: boolean | null;
    title?: string | null;
    content?: string | null;
};
export declare type PostUpdateManyWithWhereNestedInput = {
    where: PostScalarWhereInput;
    data: PostUpdateManyDataInput;
};
export declare type PostUpsertWithWhereUniqueWithoutAuthorInput = {
    where: PostWhereUniqueInput;
    update: PostUpdateWithoutAuthorDataInput;
    create: PostCreateWithoutAuthorInput;
};
export declare type PostUpdateManyWithoutAuthorInput = {
    create?: Enumerable<PostCreateWithoutAuthorInput> | null;
    connect?: Enumerable<PostWhereUniqueInput> | null;
    set?: Enumerable<PostWhereUniqueInput> | null;
    disconnect?: Enumerable<PostWhereUniqueInput> | null;
    delete?: Enumerable<PostWhereUniqueInput> | null;
    update?: Enumerable<PostUpdateWithWhereUniqueWithoutAuthorInput> | null;
    updateMany?: Enumerable<PostUpdateManyWithWhereNestedInput> | null;
    deleteMany?: Enumerable<PostScalarWhereInput> | null;
    upsert?: Enumerable<PostUpsertWithWhereUniqueWithoutAuthorInput> | null;
};
export declare type UserUpdateInput = {
    id?: string | null;
    password?: string | null;
    name?: string | null;
    posts?: PostUpdateManyWithoutAuthorInput | null;
};
export declare type UserUpdateManyMutationInput = {
    id?: string | null;
    password?: string | null;
    name?: string | null;
};
export declare type HeroCreateInput = {
    id?: string | null;
    heroName: string;
    hitpoints: number;
};
export declare type HeroUpdateInput = {
    id?: string | null;
    heroName?: string | null;
    hitpoints?: number | null;
};
export declare type HeroUpdateManyMutationInput = {
    id?: string | null;
    heroName?: string | null;
    hitpoints?: number | null;
};
export declare type StringFilter = {
    equals?: string | null;
    not?: string | StringFilter | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string | null;
    lte?: string | null;
    gt?: string | null;
    gte?: string | null;
    contains?: string | null;
    startsWith?: string | null;
    endsWith?: string | null;
};
export declare type PostFilter = {
    every?: PostWhereInput | null;
    some?: PostWhereInput | null;
    none?: PostWhereInput | null;
};
export declare type DateTimeFilter = {
    equals?: Date | string | null;
    not?: Date | string | DateTimeFilter | null;
    in?: Enumerable<Date | string> | null;
    notIn?: Enumerable<Date | string> | null;
    lt?: Date | string | null;
    lte?: Date | string | null;
    gt?: Date | string | null;
    gte?: Date | string | null;
};
export declare type BooleanFilter = {
    equals?: boolean | null;
    not?: boolean | BooleanFilter | null;
};
export declare type NullableStringFilter = {
    equals?: string | null | null;
    not?: string | null | NullableStringFilter | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string | null;
    lte?: string | null;
    gt?: string | null;
    gte?: string | null;
    contains?: string | null;
    startsWith?: string | null;
    endsWith?: string | null;
};
export declare type IntFilter = {
    equals?: number | null;
    not?: number | IntFilter | null;
    in?: Enumerable<number> | null;
    notIn?: Enumerable<number> | null;
    lt?: number | null;
    lte?: number | null;
    gt?: number | null;
    gte?: number | null;
};
export declare type PostOrderByInput = {
    id?: OrderByArg | null;
    createdAt?: OrderByArg | null;
    updatedAt?: OrderByArg | null;
    published?: OrderByArg | null;
    title?: OrderByArg | null;
    content?: OrderByArg | null;
};
export declare type UserOrderByInput = {
    id?: OrderByArg | null;
    password?: OrderByArg | null;
    name?: OrderByArg | null;
};
export declare type HeroOrderByInput = {
    id?: OrderByArg | null;
    heroName?: OrderByArg | null;
    hitpoints?: OrderByArg | null;
};
/**
 * Batch Payload for updateMany & deleteMany
 */
export declare type BatchPayload = {
    count: number;
};
/**
 * DMMF
 */
export declare const dmmf: DMMF.Document;
export {};
