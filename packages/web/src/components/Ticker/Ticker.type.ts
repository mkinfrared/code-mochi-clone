import { getNumber } from "../../store/reducers/counter/selectors";

export interface TickerProps {
  number: ReturnType<typeof getNumber>;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}
