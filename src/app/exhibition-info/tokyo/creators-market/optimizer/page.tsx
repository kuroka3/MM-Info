import { runHeatSlice } from '@cm/cmo-run'

export default function OptimizerPage(){
  const slice = runHeatSlice('8/29(금)', 0)
  return (
    <div>
      <h1>Creators Market Optimizer</h1>
      <pre>{JSON.stringify(slice.entries.slice(0,5), null, 2)}</pre>
    </div>
  )
}
