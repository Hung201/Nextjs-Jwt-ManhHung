'use client'
import { useState } from "react";
import { Button, Popconfirm, Table, message } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import OwnerMenuCreate from "./owner.menu.create";
import OwnerMenuUpdate from "./owner.menu.update";
import { handleDeleteMenuAction } from "@/utils/actions";

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

const OwnerMenuTable = (props: IProps) => {
    const { menus, meta, restaurants } = props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const columns = [
        {
            title: "STT",
            render: (_: any, record: any, index: number) => (
                <span>{index + 1 + (meta.current - 1) * meta.pageSize}</span>
            ),
        },
        {
            title: "_id",
            dataIndex: "_id",
        },
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Restaurant",
            dataIndex: "restaurant_id",
            render: (restaurant: any) => {
                if (restaurant && typeof restaurant === 'object') {
                    return <span>{restaurant.name}</span>;
                }
                const r = restaurants.find((r) => r._id === restaurant);
                return <span>{r ? r.name : restaurant}</span>;
            },
        },
        {
            title: "Actions",
            render: (_: any, record: any) => (
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <EditTwoTone
                        twoToneColor="#f57800"
                        style={{ cursor: "pointer", fontSize: 20 }}
                        onClick={() => {
                            setIsUpdateModalOpen(true);
                            setDataUpdate(record);
                        }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa menu"}
                        description={"Bạn có chắc chắn muốn xóa menu này?"}
                        onConfirm={async () => {
                            const res = await handleDeleteMenuAction(record._id);
                            if (res?.data) message.success("Xóa thành công!");
                            else message.error(res?.message || "Xóa thất bại!");
                        }}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <DeleteTwoTone twoToneColor="#ff4d4f" style={{ cursor: "pointer", fontSize: 20 }} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span>Manager My Menu</span>
                <Button onClick={() => setIsCreateModalOpen(true)}>Create Menu</Button>
            </div>
            <Table
                bordered
                dataSource={menus}
                columns={columns}
                rowKey={"_id"}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => (
                        <div>
                            {range[0]}-{range[1]} trên {total} rows
                        </div>
                    ),
                }}
            />
            <OwnerMenuCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                restaurants={restaurants}
            />
            <OwnerMenuUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                restaurants={restaurants}
            />
        </>
    );
};

export default OwnerMenuTable;
