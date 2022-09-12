import type { SvelteComponentTyped } from "svelte";

export type EventsHandlers<Component> = Component extends SvelteComponentTyped<
  unknown,
  infer EventsMap,
  unknown
>
  ? {
      [Event in keyof EventsMap]: (e: EventsMap[Event]) => void;
    }
  : never;
