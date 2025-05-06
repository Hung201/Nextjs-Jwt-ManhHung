'use client'
import { handleDeleteUserAction } from "@/utils/actions";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Popconfirm, Table, Tag } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";
import UserCreate from "./user.create";
import UserUpdate from "./user.update";


interface IProps {
    users: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
}
const UserTable = (props: IProps) => {
    const { users, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'red';
            case 'OWNER':
                return 'blue';
            case 'USERS':
                return 'green';
            case 'CUSTOMER':
                return 'purple';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: "STT",
            render: (_: any, record: any, index: any) => {
                return (
                    <>{(index + 1) + (meta.current - 1) * (meta.pageSize)}</>
                )
            }
        },
        {
            title: '_id',
            dataIndex: '_id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            render: (role: string) => (
                <Tag color={getRoleColor(role)}>
                    {role}
                </Tag>
            )
        },
        {
            title: 'Actions',
            render: (text: any, record: any, index: any) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", fontSize: '20px' }}
                            onClick={() => {
                                setIsUpdateModalOpen(true);
                                setDataUpdate(record);
                            }}
                        />

                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            onConfirm={async () => await handleDeleteUserAction(record?._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{ cursor: "pointer", fontSize: '20px' }}
                            />
                        </Popconfirm>
                    </div>
                )
            }
        }
    ];

    const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
        if (pagination && pagination.current) {
            const params = new URLSearchParams(searchParams);
            params.set('current', pagination.current);
            replace(`${pathname}?${params.toString()}`);
        }
    };


    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Manager Users</span>
                <Button onClick={() => setIsCreateModalOpen(true)}>Create User</Button>
            </div>
            <Table
                bordered
                dataSource={users}
                columns={columns}
                rowKey={"_id"}
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }
                onChange={onChange}
            />

            <UserCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />

            <UserUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}

export default UserTable;
