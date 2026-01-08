import React, { Children, ReactNode } from 'react';

type Props<T> = {
  items: T[];
  render: (item: T, index: number) => ReactNode;
};

export function Map<T>({ items, render }: Props<T>) {
  return (
    <>{Children.toArray(items.map((item, index) => render(item, index)))}</>
  );
}
