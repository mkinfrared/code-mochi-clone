import { AppState } from "src/store/store.type";

const getNumber = (state: AppState) => state.counter.number;

export default getNumber;
