import { component, RenderComponent } from '@fiar/workbench'
import cn from 'mcn'

import { ContentFieldProvider, useField } from '../../context/field'
import { FieldRecord } from '../../schema'

export const ContentFieldRecord = component('content:field:record', () => {
  const ctx = useField<FieldRecord>()
  return (
    <div className="">
      <h4 className="text-front/50 mb-6 mt-3 text-sm font-semibold uppercase">{ctx.options.label}</h4>
      <div className="">
        {Object.keys(ctx.options.fields).map((key) => (
          <div className={cn('w-full pb-4')} key={key}>
            <ContentFieldProvider value={ctx.options.fields[key]} path={key}>
              <RenderComponent name={ctx.options.fields[key].options.component} />
            </ContentFieldProvider>
          </div>
        ))}
      </div>
    </div>
  )
})
