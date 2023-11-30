export type BinaryNode<T> = {
  left: BinaryNode<T> | null;
  right: BinaryNode<T> | null;
  data: T;
};
