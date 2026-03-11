import { ComponentType, ReactNode } from "react";

interface Props {
  providers: ComponentType<{ children: ReactNode }>[];
  children: ReactNode;
}

export default function BindProvider({ providers, children }: Props) {
  return (
    <>
      {providers.reduce((acc, Provider) => {
        return <Provider>{acc}</Provider>;
      }, children)}
    </>
  );
}
