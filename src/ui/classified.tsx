'use client'

import { createContext, Fragment, useContext, useEffect, useRef } from 'react'
import { classNames } from '~/ui/class-names'
import { useClientRect } from '~/ui/hooks/use-client-rect'

let ClassifiedContext = createContext(true)

export function ClassifiedProvider(props: { children: React.ReactNode; value: boolean }) {
  useEffect(() => {
    if (props.value) {
      document.documentElement.dataset.classified = 'true'
    } else {
      delete document.documentElement.dataset.classified
    }
  }, [props.value])
  return (
    <ClassifiedContext.Provider value={props.value}>{props.children}</ClassifiedContext.Provider>
  )
}

export function useIsClassified() {
  return useContext(ClassifiedContext)
}

export function Classified(props: { children: React.ReactNode }) {
  let classified = useIsClassified()

  let container = useRef<HTMLDivElement | null>(null)
  let { width = 0, height = 0 } = useClientRect(container)

  let padding = 0

  return (
    <>
      <span
        ref={container}
        className={classNames(classified && 'pointer-events-none relative select-none')}
      >
        <Fragment>{props.children}</Fragment>
        {classified && (
          <span
            style={{
              width: width + padding,
              height: height + padding,
            }}
            className="pointer-events-none absolute inset-0 z-50 h-full w-full select-none bg-zinc-950"
          />
        )}
      </span>
    </>
  )
}