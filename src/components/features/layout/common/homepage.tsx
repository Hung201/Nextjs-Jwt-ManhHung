'use client'

import { CrownOutlined } from "@ant-design/icons"
import { Result } from "antd"

const Homepage = () => {
    return (
        <div style={{ padding: 20 }}>
            <Result
                icon={<CrownOutlined />}
                title="Fullstack Next/Nest - createdBy @hung"
            />
        </div>
    )
}

export default Homepage;

