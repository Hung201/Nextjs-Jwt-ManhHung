'use client';

import React from 'react';
import { Modal, Button, Checkbox, message } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useCart } from '@/contexts/CartContext';

interface ProductOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItem: any;
}

const ProductOptionsModal: React.FC<ProductOptionsModalProps> = ({
    isOpen,
    onClose,
    selectedItem,
}) => {
    const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string | null>>({});
    const [quantity, setQuantity] = React.useState(1);
    const { addToCart } = useCart();

    // Reset selected options when modal opens with new item
    React.useEffect(() => {
        if (isOpen) {
            setSelectedOptions({});
            setQuantity(1);
        }
    }, [isOpen, selectedItem]);

    const handleOptionChange = (optionId: string, checked: boolean) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [optionId]: checked ? optionId : null
        }));
    };

    const handleQuantityChange = (value: number) => {
        if (value >= 1) {
            setQuantity(value);
        }
    };

    const calculateTotalPrice = () => {
        let total = selectedItem?.base_price || 0;

        // Add selected options prices (3000đ per option)
        Object.keys(selectedOptions).forEach((optionId) => {
            if (selectedOptions[optionId]) {
                total += 3000; // Giá cố định cho mỗi option là 3000đ
            }
        });

        return total;
    };

    const getImageSrc = (img: string) => {
        if (!img || img.trim() === '') return '/no-image.png';
        if (img.startsWith('data:image')) return img;
        return `http://localhost:8080/uploads/${img}`;
    };

    const handleSubmit = () => {
        console.log("Selected Item:", selectedItem); // Debug log

        const cartItem = {
            id: selectedItem._id,
            name: selectedItem.title,
            price: calculateTotalPrice(),
            quantity,
            image: getImageSrc(selectedItem.image),
            selectedOptions
        };

        console.log("Adding to cart:", cartItem); // Debug log
        addToCart(cartItem);
        onClose();
    };

    // Flatten options for display
    const flattenedOptions = selectedItem?.options?.map((option: any) => ({
        _id: option._id,
        title: option.title,
        additionalPrice: 3000 // Giá cố định cho mỗi option
    })) || [];

    return (
        <Modal
            title={<div className="text-xl">Thêm món mới</div>}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={400}
            className="select-none"
        >
            <div className="max-h-[80vh] overflow-y-auto">
                {/* Product Info */}
                <div className="flex gap-3 mb-6">
                    <img
                        src={getImageSrc(selectedItem?.image)}
                        alt={selectedItem?.title}
                        className="w-14 h-14 object-cover rounded"
                    />
                    <div className="flex-1">
                        <h3 className="text-base mb-1">{selectedItem?.title}</h3>
                        <div className="text-gray-500 text-sm">
                            {selectedItem?.likes} đã thích • {selectedItem?.sold} lượt thích
                        </div>
                        <div className="text-[#ee4d2d]">
                            {selectedItem?.base_price?.toLocaleString()}đ
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            icon={<MinusOutlined />}
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="flex items-center justify-center border-gray-300"
                            disabled={quantity <= 1}
                            size="small"
                        />
                        <span className="min-w-[24px] text-center">{quantity}</span>
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="flex items-center justify-center border-gray-300"
                            size="small"
                        />
                    </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {flattenedOptions.map((option: any) => (
                        <div key={option._id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedOptions[option._id] === option._id}
                                    onChange={(e) => handleOptionChange(option._id, e.target.checked)}
                                />
                                <span className="uppercase">{option.title}</span>
                            </div>
                            <span className="text-gray-500">
                                {option.additionalPrice?.toLocaleString()}đ
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6">
                <Button
                    type="primary"
                    className="w-full h-11 text-white bg-[#0d6efd] hover:bg-[#0b5ed7] flex items-center justify-center"
                    onClick={handleSubmit}
                >
                    Thêm vào giỏ hàng - {(calculateTotalPrice() * quantity).toLocaleString()}đ
                </Button>
            </div>
        </Modal>
    );
};

export default ProductOptionsModal; 