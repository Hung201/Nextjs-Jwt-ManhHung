"use client";
import React, { useEffect, useState } from "react";

interface MomoResultClientProps {
    searchParams: { [key: string]: string };
}

const MomoResultClient: React.FC<MomoResultClientProps> = ({ searchParams }) => {
    const [status, setStatus] = useState<'pending' | 'success' | 'fail'>('pending');

    useEffect(() => {
        const resultCode = searchParams?.resultCode;
        if (resultCode === '0') {
            setStatus('success');
        } else {
            setStatus('fail');
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {status === 'pending' && <p>Đang xác nhận thanh toán...</p>}
            {status === 'success' && <p className="text-green-600 text-xl">Thanh toán MoMo thành công!</p>}
            {status === 'fail' && <p className="text-red-600 text-xl">Thanh toán MoMo thất bại hoặc bị huỷ.</p>}
        </div>
    );
};

export default MomoResultClient; 