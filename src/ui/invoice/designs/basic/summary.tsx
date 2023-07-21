import { Invoice } from '~/domain/invoice/invoice'
import { summary, Summary } from '~/domain/invoice/summary'
import { Money } from '~/ui/money'
import { match } from '~/utils/match'

let summaryItems: {
  [P in Summary['type']]: (
    item: Extract<Summary, { type: P }>,
  ) => [React.ReactNode, React.ReactNode]
} = {
  subtotal: (item) => {
    return [
      <>{item.subtype === 'discounts' ? 'Totaal (kortingen)' : 'Subtotaal'}</>,
      <>
        <Money amount={item.value} />
      </>,
    ]
  },
  total: (item) => {
    return [
      <>
        <span className="font-bold">Totaal</span>
      </>,
      <>
        <span className="font-bold">
          <Money amount={item.value} />
        </span>
      </>,
    ]
  },
  vat: (item) => {
    return [
      <>{`BTW (${(item.rate * 100).toFixed(0)}%)`}</>,
      <>
        <Money amount={item.value} />
      </>,
    ]
  },
  discount: (item) => {
    return [
      <>
        Korting
        {item.discount.reason && (
          <>
            <span className="px-1">
              (<span className="text-xs font-medium text-gray-400">{item.discount.reason}</span>)
            </span>
          </>
        )}
      </>,
      <>
        {match(item.discount.type, {
          fixed: () => <Money amount={-1 * item.discount.value} />,
          percentage: () => <>{(-1 * (item.discount.value * 100)).toFixed(0)}%</>,
        })}
      </>,
    ]
  },
}

export function Summary({
  items,
  discounts,
  type = 'all',
}: {
  items: Invoice['items']
  discounts: Invoice['discounts']
  type: 'all' | 'subtotal'
}) {
  if (items.length === 0) return null
  let summaryInfo = summary({ items, discounts })

  return (
    <>
      <tr>
        <td></td>
        <td colSpan={4} className="pb-3 pl-4 pr-12">
          <div className="h-1 w-full rounded-full bg-gray-50"></div>
        </td>
      </tr>
      {summaryInfo
        .filter(type === 'subtotal' ? (summaryItem) => summaryItem.type === 'subtotal' : () => true)
        .map((summaryItem, idx) => {
          // @ts-ignore
          let [label, value] = summaryItems[summaryItem.type](summaryItem)
          return (
            <tr key={idx}>
              <td />
              <th
                colSpan={2}
                className="whitespace-nowrap px-4 py-1 text-left text-sm font-normal text-gray-500"
              >
                {label}
              </th>
              <td
                colSpan={2}
                className="whitespace-nowrap px-4 py-1 pl-4 pr-12 text-right align-top text-sm text-gray-500"
              >
                {value}
              </td>
            </tr>
          )
        })}

      <tr>
        <td className="py-1" />
      </tr>
    </>
  )
}
