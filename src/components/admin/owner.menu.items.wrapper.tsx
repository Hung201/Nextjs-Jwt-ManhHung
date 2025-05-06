import OwnerMenuItemsTable from "./owner.menu.items.table";

interface IProps {
    menuItems: any[];
    meta: any;
    menus: any[];
}

const OwnerMenuItemsWrapper = ({ menuItems, meta, menus }: IProps) => {
    return <OwnerMenuItemsTable menuItems={menuItems} meta={meta} menus={menus} />;
};

export default OwnerMenuItemsWrapper;
