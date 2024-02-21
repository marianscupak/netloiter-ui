import { atom } from "jotai";

interface StatusAtom {
  runningFrom: Date | false;
}

export const statusAtom = atom<StatusAtom>({ runningFrom: false });
