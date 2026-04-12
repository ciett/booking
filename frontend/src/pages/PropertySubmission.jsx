import React, { useState } from 'react';
import { Steps, Form, Input, Button, Select, message, Result, InputNumber } from 'antd';
import { HomeOutlined, EnvironmentOutlined, PictureOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const PropertySubmission = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const stepFields = [
        ['propertyType', 'name', 'rating'],
        ['city', 'address'],
        ['imageUrl', 'description', 'price']
    ];

    const onNext = async () => {
        try {
            await form.validateFields(stepFields[currentStep]);
            setCurrentStep(currentStep + 1);
        } catch (error) {
            message.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
        }
    };

    const onPrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const onFinish = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            
            // Map form data to Backend standard:
            // Hotel(city, name, address, description, rating, imageUrl)
            const payload = {
                name: values.propertyType === 'Khách sạn' ? values.name : `${values.propertyType} ${values.name}`,
                city: values.city,
                address: values.address,
                description: values.description || `Chào mừng bạn đến với ${values.name}. Đây là chỗ nghỉ tuyệt vời tại ${values.city}.`,
                rating: Number(values.rating || 5), // Gửi trực tiếp chuẩn thang 5 về CSDL
                price: values.price || 0,
                imageUrl: values.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
            };

            await axios.post('/api/hotels', payload);
            setIsSuccess(true);
        } catch (error) {
            message.error("Đã có lỗi xảy ra. Hãy thử lại!");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center -mt-10">
                <div className="bg-white p-10 rounded-xl shadow-lg max-w-lg w-full">
                    <Result
                        status="success"
                        title="Bạn đã gửi đơn Đăng chỗ nghỉ thành công!"
                        subTitle="Phiếu đăng tin của bạn đã được lưu tệp hệ thống. Chỗ nghỉ sẽ xuất hiện trên trang tìm kiếm trong chốc lát."
                        extra={[
                            <Button type="primary" size="large" className="bg-[#006ce4]" key="home" onClick={() => navigate('/')}>
                                Về trang chủ
                            </Button>,
                            <Button size="large" key="search" onClick={() => navigate('/search-results?city=' + form.getFieldValue('city'))}>
                                Tìm thử chỗ nghỉ của bạn
                            </Button>
                        ]}
                    />
                </div>
            </div>
        );
    }

    const steps = [
        {
            title: 'Tên & Cấp độ',
            icon: <HomeOutlined />,
            content: (
                <div className="space-y-4 animate-fade-in-up">
                    <h2 className="text-2xl font-bold mb-4 text-[#006ce4]">Bạn muốn đăng loại chỗ nghỉ nào?</h2>
                    <Form.Item name="propertyType" label="Loại hình" rules={[{ required: true, message: 'Vui lòng chọn loại hình!' }]}>
                        <Select placeholder="Chọn loại (Khách sạn, Căn hộ,...)" size="large">
                            <Option value="Khách sạn">Khách sạn</Option>
                            <Option value="Căn hộ">Căn hộ chung cư</Option>
                            <Option value="Biệt thự">Biệt thự (Villa)</Option>
                            <Option value="Resort">Khu nghỉ dưỡng (Resort)</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="name" label="Tên chỗ nghỉ" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                        <Input size="large" placeholder="Ví dụ: Mường Thanh Luxury hoặc Ocean View Apartment" />
                    </Form.Item>
                    <Form.Item name="rating" label="Tiêu chuẩn số Sao (Đánh giá mục tiêu)">
                        <InputNumber size="large" min={1} max={5} style={{ width: '100%' }} placeholder="Thang 5 sao (Ví dụ: 4)" />
                    </Form.Item>
                </div>
            )
        },
        {
            title: 'Vị trí',
            icon: <EnvironmentOutlined />,
            content: (
                <div className="space-y-4 animate-fade-in-up">
                    <h2 className="text-2xl font-bold mb-4 text-[#006ce4]">Chỗ nghỉ này nằm ở đâu?</h2>
                    <Form.Item name="city" label="Thành phố/Tỉnh" rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}>
                        <Input size="large" placeholder="Ví dụ: Hà Nội, Đà Nẵng, Hồ Chí Minh" />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ cụ thể" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                        <TextArea rows={3} placeholder="Ví dụ: Số 123 Đường Trần Phú, Quận Hải Châu..." />
                    </Form.Item>
                </div>
            )
        },
        {
            title: 'Chi tiết',
            icon: <PictureOutlined />,
            content: (
                <div className="space-y-4 animate-fade-in-up">
                    <h2 className="text-2xl font-bold mb-4 text-[#006ce4]">Hình ảnh & Thông tin thêm</h2>
                    <Form.Item name="price" label="Giá cơ bản 1 đêm (VND)" rules={[{ required: true, message: 'Vui lòng nhập giá tối thiểu!' }]}>
                        <InputNumber size="large" min={0} step={50000} style={{ width: '100%' }} placeholder="Ví dụ: 800000" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')}/>
                    </Form.Item>
                    <Form.Item name="imageUrl" label="Đường dẫn Ảnh (URL)" tooltip="Để trống hệ thống sẽ dùng ảnh mặc định">
                        <Input size="large" placeholder="https://example.com/image.jpg" />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả cho khách hàng đọc">
                        <TextArea rows={4} placeholder="Hãy viết vài dòng hấp dẫn để thu hút du khách..." />
                    </Form.Item>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl">
                <div>
                    <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
                        Đăng ký Chỗ nghỉ của bạn
                    </h1>
                    <Steps current={currentStep} items={steps.map(s => ({ title: s.title, icon: s.icon }))} className="mb-10" />
                </div>
                
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-8"
                    initialValues={{ rating: 5 }}
                >
                    <div className="min-h-[250px] p-2">
                        {steps.map((step, index) => (
                            <div key={index} style={{ display: currentStep === index ? 'block' : 'none' }}>
                                {step.content}
                            </div>
                        ))}
                    </div>
                </Form>

                <div className="flex justify-between mt-8 border-t border-gray-100 pt-6">
                    {currentStep > 0 ? (
                        <Button size="large" onClick={onPrev}>Quay lại</Button>
                    ) : <div></div>}

                    {currentStep < steps.length - 1 && (
                        <Button type="primary" size="large" className="bg-[#006ce4] px-8" onClick={onNext}>
                            Tiếp tục
                        </Button>
                    )}
                    
                    {currentStep === steps.length - 1 && (
                        <Button 
                            type="primary" 
                            size="large" 
                            className="bg-green-600 hover:bg-green-700 px-8 border-none" 
                            icon={<CheckCircleOutlined />} 
                            onClick={onFinish}
                            loading={submitting}
                        >
                            Hoàn tất Đăng tin
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertySubmission;
