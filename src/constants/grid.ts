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
