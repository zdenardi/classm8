export const BASE_GRID_STYLE = {
  backgroundColor: "var(--grey-950)",
  foregroundColor: "var(--grey-100)",
  headerBackgroundColor: "transparent",
  headerTextColor: "var(--grey-100)",
  headerFontWeight: "600",
  headerFontSize: "14px",
  rowBorder: "none",
  wrapperBorder: "none",
  borderColor: "var(--grey-100)",
  fontFamily: "Inter",
  footerRowBorder: "1px solid var(--grey-100)",
};
export const ERROR_STYLE =
  " border-1 border-red-500 outline-red-500 text-red-500 focus:outline-red-500";
export const GRID_CONTAINER =
  "grid gap-[30px] mx-auto max-[1360px]:grid-cols-[repeat(6,100px)] max-[1360px]:w-[750px] min-[1360px]:grid-cols-[repeat(12,80px)] min-[1360px]:w-[1290px]";
export const HALF_WIDTH = "max-[1360px]:col-span-3 min-[1360px]:col-span-6";
export const FULL_WIDTH = "max-[1500px]:col-span-6 min-[1360px]:col-span-12";
export const ONE_THIRD_WIDTH =
  "max-[1360px]:col-span-2 min-[1360px]:col-span-4";
export const LG_HALF_SM_FULL =
  "max-[1360px]:col-span-6 min-[1360px]:col-span-6";

// export const DeleteCellRenderer = (
//   props: CustomCellRendererProps & { onDelete: (id: number) => void; cyTag: string }
// ) => {
//   const handleDeleteClick = () => {
//     props.onDelete(props.data.id);
//   };
//   return (
//     <button type="button">
//       <MinusCircleIcon
//         data-cy={`${props.cyTag}-${props.node.rowIndex}`}
//         onClick={handleDeleteClick}
//         aria-hidden="true"
//         className={'size-5 shrink-0 hover:text-primary-50'}
//       />
//     </button>
//   );
// };

// export const EditCellRenderer = (
//   props: CustomCellRendererProps & { onEdit: (id: number) => void; cyTag: string }
// ) => {
//   const handleEditClick = () => {
//     props.onEdit(props.data.id);
//   };
//   return (
//     <button type="button">
//       <PencilIcon
//         data-cy={`${props.cyTag}-${props.node.rowIndex}`}
//         onClick={handleEditClick}
//         aria-hidden="true"
//         className={'size-5 shrink-0 hover:text-primary-50'}
//       />
//     </button>
//   );
// };

// export const ACTION_COLUMN_STYLES = {
//   field: '',
//   width: 25,
//   flex: 0,
//   cellStyle: { display: 'flex', justifyContent: 'center' },
//   editable: false,
//   sortable: false,
//   filter: false,
// };
