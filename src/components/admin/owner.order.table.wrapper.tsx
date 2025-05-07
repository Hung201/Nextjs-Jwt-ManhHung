import OwnerOrderTable from './owner.order.table';

interface IProps {
    orders: any[];
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
}

const OwnerOrderTableWrapper = ({ orders, meta }: IProps) => {
    return <OwnerOrderTable orders={orders} meta={meta} />;
};

export default OwnerOrderTableWrapper; 