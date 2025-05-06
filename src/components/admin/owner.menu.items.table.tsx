'use client';
import { useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import OwnerMenuItemsCreate from "./owner.menu.items.create";
import OwnerMenuItemUpdate from "./owner.menu.items.update";
import { handleDeleteMenuItemAction } from "@/utils/actions";
import { useRouter, useSearchParams } from "next/navigation";

interface IProps {
    menuItems: any[];
    meta: any;
    menus: any[];
}

const OwnerMenuItemsTable = ({ menuItems, meta, menus }: IProps) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const columns = [
        { title: "STT", render: (_: any, __: any, idx: number) => idx + 1 + (meta.current - 1) * meta.pageSize },
        { title: "Title", dataIndex: "title" },
        { title: "Description", dataIndex: "description" },
        { title: "Base Price", dataIndex: "base_price" },
        { title: "Image", dataIndex: "image", render: (img: string) => img ? <img src={img} alt="" style={{ width: 40, height: 40, objectFit: "cover" }} /> : null },
        { title: "Menu", dataIndex: "menu_id", render: (menu: any) => menu?.title || "" },
        {
            title: "Actions",
            render: (_: any, record: any) => (
                <div style={{ display: "flex", gap: 12 }}>
                    <EditTwoTone onClick={() => { setIsUpdateModalOpen(true); setDataUpdate(record); }} />
                    <Popconfirm
                        title="Xác nhận xóa?"
                        onConfirm={async () => {
                            const res = await handleDeleteMenuItemAction(record._id);
                            if (res?.data) message.success("Xóa thành công!");
                            else message.error(res?.message || "Xóa thất bại!");
                        }}
                    >
                        <DeleteTwoTone twoToneColor="#ff4d4f" />
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <span>Manager Menu Items</span>
                <Button onClick={() => setIsCreateModalOpen(true)}>Create Menu Item</Button>
            </div>
            <Table
                bordered
                dataSource={menuItems}
                columns={columns}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                }}
                onChange={(pagination) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("current", String(pagination.current));
                    params.set("pageSize", String(pagination.pageSize));
                    router.push(`?${params.toString()}`);
                }}
            />
            <OwnerMenuItemsCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                menus={menus}
            />
            <OwnerMenuItemUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                menus={menus}
            />
        </>
    );
};

export default OwnerMenuItemsTable; 