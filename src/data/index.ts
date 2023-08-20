import { Account } from '~/domain/account/account'
import { Record, separateRecords } from '~/domain/record/record'

let data = require(`./${process.env.DATA_SOURCE_FILE}.ts`)

export let me: Account = data.me
export let records: Record[] = separateRecords(data.records)

// For each record in the system, we should be able to find all related records in either layers
// below or layers above.
export let stacks: { [id: string]: string[] } = {}

for (let record of records) {
  stacks[record.id] ??= [record.id]

  let records = separateRecords([record])

  for (let record of records) {
    for (let other of records) {
      if (record === other) continue

      stacks[record.id] ??= [record.id]
      stacks[record.id].push(other.id)

      stacks[other.id] ??= [other.id]
      stacks[other.id].push(record.id)
    }
  }
}

for (let [idx, stack] of Object.entries(stacks)) {
  stacks[idx] = Array.from(new Set(stack))
}

let order = ['quote', 'invoice', 'receipt']
for (let stack of Object.values(stacks)) {
  stack.sort((aId, zId) => {
    let a = records.find((e) => e.id === aId)!
    let z = records.find((e) => e.id === zId)!

    return order.indexOf(a.type) - order.indexOf(z.type) || a.number.localeCompare(z.number)
  })
}
