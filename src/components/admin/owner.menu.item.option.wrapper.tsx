import OwnerMenuItemOptionTable from "./owner.menu.item.option.table";

interface IProps {
    menuItemOptions: any[];
    meta: any;
    menuItems: any[];
}

const OwnerMenuItemOptionWrapper = ({ menuItemOptions, meta, menuItems }: IProps) => {
    return <OwnerMenuItemOptionTable menuItemOptions={menuItemOptions} meta={meta} menuItems={menuItems} />;
};

export default OwnerMenuItemOptionWrapper;
