import type { ReactNode } from "react";

import type { AsyncState } from "../async";
import Icon from "../ui/Icon";

interface Props<T> {
  state: AsyncState<T>;
  children: (data: T) => ReactNode;
}


export default function AsyncBoundary<T>({ state, children }: Props<T>) {
  if (state.error) {
    return (
      <section className="card">
        <div className="card-header">
          <span className="icon-tile icon-tile-danger">
            <Icon name="triangle-alert" size={15} strokeWidth={2.2} />
          </span>
          <h2>Could not load</h2>
        </div>
        <p className="empty-note">{state.error.message}</p>
        <div className="card-footer-actions">
          <span className="alert-code">{state.error.code}</span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={state.reload}
          >
            <Icon name="refresh-cw" size={13} />
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (state.data === null) {
    return (
      <section className="card">
        <p className="empty-note">Loading…</p>
      </section>
    );
  }

  return <>{children(state.data)}</>;
}
