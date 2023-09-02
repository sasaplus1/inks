import * as React from 'react';

type FocusedIdContextValue = {
  focusedId: string;
  setFocusedId: (focusedId: string) => void;
};

const FocusedIdContext = React.createContext<FocusedIdContextValue | undefined>(
  undefined
);

type FocusedIdProviderProps = {
  children: React.ReactNode;
};

/**
 * provide focused id and setter for focused id
 */
export function FocusedIdProvider(props: FocusedIdProviderProps) {
  const { children } = props;

  const [focusedId, setFocusedId] = React.useState<string>('');

  return (
    <FocusedIdContext.Provider
      value={{
        focusedId,
        setFocusedId
      }}
    >
      {children}
    </FocusedIdContext.Provider>
  );
}

type UseSetFocusedIdParams = {
  id: string;
  nestedId: string;
  isFocused: boolean;
};

/**
 * provide focused id and setter for focused id
 */
export function useFocusedId() {
  const context = React.useContext(FocusedIdContext);

  if (!context) {
    throw new Error('useFocusedId must be used within a FocusedIdProvider');
  }

  const { focusedId, setFocusedId } = context;

  return {
    focusedId,
    useSetFocusedId(params: UseSetFocusedIdParams) {
      const { id, isFocused, nestedId } = params;

      React.useEffect(() => {
        if (isFocused) {
          setFocusedId(`${nestedId}.${id}`);
        }
      }, [id, isFocused, nestedId]);
    }
  };
}

//------------------------------------------------------------------------------

const NestedIdContext = React.createContext<string>('');

type NestedIdProviderProps = {
  children: React.ReactNode;
  id: string;
};

/**
 * provide nested id
 */
export function NestedIdProvider(props: NestedIdProviderProps) {
  const { children, id } = props;

  const nestedId = React.useContext(NestedIdContext);

  return (
    <NestedIdContext.Provider value={`${nestedId}.${id}`}>
      {children}
    </NestedIdContext.Provider>
  );
}

/**
 * provide nested id
 */
export function useNestedId() {
  const context = React.useContext(NestedIdContext);

  if (!context) {
    throw new Error('useNestedId must be used within a NestedIdProvider');
  }

  return { nestedId: context };
}

//------------------------------------------------------------------------------

/**
 * check if id is focused
 *
 * @param id - id
 * @returns true if id in nested id
 */
export function useFocusWithin(id: string) {
  const { focusedId } = useFocusedId();

  return focusedId.includes(`.${id}`);
}
