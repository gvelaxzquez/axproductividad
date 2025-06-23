import React from "react";
import { Layout, Menu, Breadcrumb, Statistic, Row, Col, Card } from "antd";
import TaskList from "./TaskList";

const { Header, Content, Footer } = Layout;

const Dashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Dashboard</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-content">
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tareas Completadas"
                  value={112}
                  valueStyle={{ color: "#3f8600" }}
                  suffix="/ 150"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tareas por Hacer"
                  value={38}
                  valueStyle={{ color: "#cf1322" }}
                  suffix="/ 150"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Progreso"
                  value={75}
                  precision={2}
                  valueStyle={{ color: "#1890ff" }}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>
          <TaskList />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>Dashboard ©2023 Created by Your Team</Footer>
    </Layout>
  );
};

export default Dashboard;