'use client';
import { useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import MenuItemOptionCreate from "./menu.item.option.create";
import MenuItemOptionUpdate from "./menu.item.option.update";
import { handleDeleteMenuItemOptionAction } from "@/utils/actions";

interface IProps {
    menuItemOptions: any[];
    meta: any;
    menuItems: any[];
}

const MenuItemOptionTable = ({ menuItemOptions, meta, menuItems }: IProps) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const columns = [
        { title: "STT", render: (_: any, __: any, idx: number) => idx + 1 + (meta.current - 1) * meta.pageSize },
        { title: "Title", dataIndex: "title" },
        { title: "Additional Price", dataIndex: "additional_price" },
        { title: "Optional Description", dataIndex: "optional_description" },
        { title: "Menu Item", dataIndex: "menu_item_id", render: (menu_item: any) => menu_item?.title || "" },
        {
            title: "Actions",
            render: (_: any, record: any) => (
                <div style={{ display: "flex", gap: 12 }}>
                    <EditTwoTone onClick={() => { setIsUpdateModalOpen(true); setDataUpdate(record); }} />
                    <Popconfirm
                        title="Xác nhận xóa?"
                        onConfirm={async () => {
                            const res = await handleDeleteMenuItemOptionAction(record._id);
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
                <span>Manager Menu Item Options</span>
                <Button onClick={() => setIsCreateModalOpen(true)}>Create Menu Item Option</Button>
            </div>
            <Table
                bordered
                dataSource={menuItemOptions}
                columns={columns}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                }}
            />
            <MenuItemOptionCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                menuItems={menuItems}
            />
            <MenuItemOptionUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                menuItems={menuItems}
            />
        </>
    );
};

export default MenuItemOptionTable;
