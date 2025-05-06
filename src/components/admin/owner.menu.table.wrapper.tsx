import OwnerMenuTable from "./owner.menu.table";

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

const OwnerMenuTableWrapper = ({ menus, meta, restaurants }: IProps) => {
    return <OwnerMenuTable menus={menus} meta={meta} restaurants={restaurants} />;
};

export default OwnerMenuTableWrapper;
