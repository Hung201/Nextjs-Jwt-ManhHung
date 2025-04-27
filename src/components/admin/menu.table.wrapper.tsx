import MenuTable from "./menu.table";

interface IProps {
    menus: any[];
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    restaurants: any[];
}

const MenuTableWrapper = ({ menus, meta, restaurants }: IProps) => {
    return <MenuTable menus={menus} meta={meta} restaurants={restaurants} />;
};

export default MenuTableWrapper; 