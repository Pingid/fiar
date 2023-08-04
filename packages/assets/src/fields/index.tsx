export * from './image'

// import { useModalSwitch, Button, Box, Modal, Menu } from '@fiar/components'
// import { useField } from '@fiar/cms/schema/field/Context'
// import { primitive, FieldData } from '@fiar/schema'
// import { field } from '@fiar/cms/schema/field'

// import { useFieldValue } from '@fiar/hooks'
// import { memo } from 'react'

// import { SelectAsset } from '../components/SelectAsset'
// import { ImagePreview } from '../components/ImageCard'

// const FieldImage = () => {
//   const control = useFieldValue<FieldImage['_type'] | null>()
//   const field = useField<FieldImage>()

//   const [open, toggle] = useModalSwitch()

//   return (
//     <div>
//       <Modal open={open} onClose={toggle} size="full">
//         <Modal.Title>Select an image</Modal.Title>
//         <div className="py-6">
//           <SelectAsset
//             onSelect={(x) => {
//               control.onChange({ bucket: x.bucket, fullPath: x.fullPath, name: x.name })
//               toggle()
//             }}
//           />
//         </div>
//       </Modal>

//       {control.data && (
//         <>
//           <Box className="w-full h-48 flex">
//             <div className="bg-highlight p-2 rounded-l-md">
//               <ImagePreview image={control.data} />
//             </div>
//             {field.options.label && <Box.Label position="tl">{field.options.label}</Box.Label>}
//           </Box>
//         </>
//       )}
//       {!control.data && (
//         <div className="w-full bg-highlight rounded-md py-3">
//           <Button onClick={toggle}>{control.data ? 'Change' : 'Find Image'}</Button>
//           {control.data && <Button onClick={() => control.onChange(null)}>Remove</Button>}
//         </div>
//       )}
//     </div>
//   )
// }

// export const image = (options?: FieldData) => {
//   return field<{ bucket: string; fullPath: string; name: string }, typeof primitive.object, null>({
//     options: { ...options, component: FieldImage },
//     type: primitive.object,
//     data: null,
//   })
// }

// // export type FieldImage = ReturnType<typeof image>
