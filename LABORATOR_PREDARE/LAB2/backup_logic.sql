--
-- PostgreSQL database dump
--

\restrict YNs9QllMrkymjFw9SeoWDxcRYIyNkX2bVEIp9RGYWgnTfbFRzPJ6Qp6PvbhEJoB

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: charts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.charts (
    id text NOT NULL,
    dashboard_id text NOT NULL,
    file_id text NOT NULL,
    chart_type text NOT NULL,
    chart_config jsonb NOT NULL,
    title text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.charts OWNER TO postgres;

--
-- Name: dashboards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dashboards (
    id text NOT NULL,
    user_id text NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.dashboards OWNER TO postgres;

--
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.files (
    id text NOT NULL,
    user_id text NOT NULL,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_size integer NOT NULL,
    file_type text NOT NULL,
    uploaded_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.files OWNER TO postgres;

--
-- Name: plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plans (
    id text NOT NULL,
    name text NOT NULL,
    max_files integer NOT NULL,
    max_charts integer NOT NULL,
    max_dashboards integer NOT NULL,
    price numeric(10,2) DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.plans OWNER TO postgres;

--
-- Name: usage_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usage_logs (
    id text NOT NULL,
    user_id text NOT NULL,
    action text NOT NULL,
    details jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.usage_logs OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    full_name text,
    plan_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('0fcdd26d-ce76-4f93-b686-9f52f4bd08b6', 'c8f5b3cacb81291bb6bb82b487bed24432ad8f6f7b1487ff4e87ed4b73e34bee', '2025-11-19 15:34:36.71885+02', '20251119133436_init', NULL, NULL, '2025-11-19 15:34:36.599507+02', 1);


--
-- Data for Name: charts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.charts (id, dashboard_id, file_id, chart_type, chart_config, title, created_at) VALUES ('60231240-8dec-4b50-810b-3ffb333640f0', 'b587bd0a-5e67-409f-8d5d-7b33c36ef079', 'f735d1db-f499-4f66-a34d-185698fc5b65', 'bar', '{"xAxis": "Product", "yAxis": "Sales"}', 'zsd', '2025-11-24 13:47:07.304');


--
-- Data for Name: dashboards; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.dashboards (id, user_id, name, description, created_at, updated_at) VALUES ('3e4b5485-ffe4-4b30-b850-5a596ff61c25', '9c5b0124-897a-4c32-a915-3dece8987b3f', 'My First Dashboard', 'Test dashboard from API', '2025-11-19 13:50:42.89', '2025-11-19 13:50:42.89');
INSERT INTO public.dashboards (id, user_id, name, description, created_at, updated_at) VALUES ('e5fdd0ac-c9bf-48dc-af99-f7ff02b3d328', '04a7e08b-00c7-435e-b1d6-e77685e3ad8a', 'Test Dashboard', 'Dashboard for testing charts', '2025-11-19 20:08:08.059', '2025-11-19 20:08:08.059');
INSERT INTO public.dashboards (id, user_id, name, description, created_at, updated_at) VALUES ('b587bd0a-5e67-409f-8d5d-7b33c36ef079', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'test', '', '2025-11-20 18:22:01.777', '2025-11-20 18:22:01.777');


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.files (id, user_id, file_name, file_path, file_size, file_type, uploaded_at) VALUES ('9631e0a0-9367-4c8a-a1cc-c0c103d1224a', '04a7e08b-00c7-435e-b1d6-e77685e3ad8a', 'test-data.csv', '/uploads/test-data.csv', 1024, 'text/csv', '2025-11-19 20:10:40.263');
INSERT INTO public.files (id, user_id, file_name, file_path, file_size, file_type, uploaded_at) VALUES ('f735d1db-f499-4f66-a34d-185698fc5b65', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'test-data-bar.csv', '1763992001138-779661148.csv', 73, 'text/csv', '2025-11-24 13:46:41.174');


--
-- Data for Name: plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.plans (id, name, max_files, max_charts, max_dashboards, price, created_at) VALUES ('9098f62f-fb90-41c4-827c-7df1ebe554aa', 'Free', 2, 3, 1, 0.00, '2025-11-19 13:39:00.895');
INSERT INTO public.plans (id, name, max_files, max_charts, max_dashboards, price, created_at) VALUES ('3c3e814a-f8be-49fc-b69e-2e85037955e2', 'Pro', 20, 50, 10, 9.99, '2025-11-19 13:39:00.911');
INSERT INTO public.plans (id, name, max_files, max_charts, max_dashboards, price, created_at) VALUES ('8da94bf3-c719-4e13-9bc8-216ee9fc6c8f', 'Custom', -1, -1, -1, 49.99, '2025-11-19 13:39:00.915');


--
-- Data for Name: usage_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('5dd9ee18-9774-4f74-818f-011048c62d52', '9c5b0124-897a-4c32-a915-3dece8987b3f', 'user_signup', '{"email": "test@example.com"}', '2025-11-19 13:50:29.735');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('74cbe32d-5a7d-4a00-9942-46ac1da1adb2', '9c5b0124-897a-4c32-a915-3dece8987b3f', 'user_login', '{"timestamp": "2025-11-19T13:50:34.620Z"}', '2025-11-19 13:50:34.623');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('d0b72d19-4a7d-4622-964d-777b1508514e', '9c5b0124-897a-4c32-a915-3dece8987b3f', 'dashboard_create', '{"name": "My First Dashboard", "dashboardId": "3e4b5485-ffe4-4b30-b850-5a596ff61c25"}', '2025-11-19 13:50:42.895');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('d5cf5a96-e04e-4b22-a0f1-c5ca21d7dbc8', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'user_signup', '{"email": "asdasda@gmail.com"}', '2025-11-19 14:13:56.758');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('cc61f3eb-2d03-405c-bbfe-a74db71899bf', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'user_login', '{"timestamp": "2025-11-19T14:13:56.941Z"}', '2025-11-19 14:13:56.942');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('64fc2db0-e96a-464d-a3ee-d2ffc2a11ca4', '04a7e08b-00c7-435e-b1d6-e77685e3ad8a', 'user_signup', '{"email": "testuser@example.com"}', '2025-11-19 20:07:54.968');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('a1a95ac5-6559-4d97-9da7-3f40506ad00d', '04a7e08b-00c7-435e-b1d6-e77685e3ad8a', 'user_login', '{"timestamp": "2025-11-19T20:08:00.779Z"}', '2025-11-19 20:08:00.781');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('54a48ece-5b0e-45da-933e-a77179525565', '04a7e08b-00c7-435e-b1d6-e77685e3ad8a', 'dashboard_create', '{"name": "Test Dashboard", "dashboardId": "e5fdd0ac-c9bf-48dc-af99-f7ff02b3d328"}', '2025-11-19 20:08:08.064');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('642c9577-5a0b-4776-88b7-42120927cebe', '04a7e08b-00c7-435e-b1d6-e77685e3ad8a', 'user_login', '{"timestamp": "2025-11-19T20:52:54.610Z"}', '2025-11-19 20:52:54.612');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('5eb46614-19b4-4581-be8c-db33e47fa3a9', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'dashboard_create', '{"name": "asd", "dashboardId": "41731855-140f-4b86-97ef-05636bfb50e8"}', '2025-11-20 12:16:11.538');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('d4bf3086-f7cf-41ef-a44d-0b22788eef5d', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'dashboard_delete', '{"dashboardId": "41731855-140f-4b86-97ef-05636bfb50e8"}', '2025-11-20 13:08:19.645');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('335d670e-85ff-4424-b780-bae97fb43ddf', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'dashboard_create', '{"name": "asdasd", "dashboardId": "1fbe2c8d-ff13-49f1-9ab2-bdeb55388c95"}', '2025-11-20 13:08:23.37');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('2e52fc33-ef3e-41bb-af2a-8868b36bf7ef', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'user_logout', '{"timestamp": "2025-11-20T16:11:44.060Z"}', '2025-11-20 16:11:44.064');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('b4e12e53-902e-4f87-a6ec-ef56b8507156', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'user_login', '{"timestamp": "2025-11-20T16:47:38.877Z"}', '2025-11-20 16:47:38.879');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('ef29947c-707f-4ad4-b4d3-77ae202507eb', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "3c3e814a-f8be-49fc-b69e-2e85037955e2", "planName": "Pro", "timestamp": "2025-11-20T17:23:04.351Z"}', '2025-11-20 17:23:04.352');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('16b55bc3-8352-456d-9205-8118e3de02bc', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "3c3e814a-f8be-49fc-b69e-2e85037955e2", "planName": "Pro", "timestamp": "2025-11-20T17:23:17.891Z"}', '2025-11-20 17:23:17.892');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('dce6781f-ba55-4796-a869-c06a6e89aaf9', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "9098f62f-fb90-41c4-827c-7df1ebe554aa", "planName": "Free", "timestamp": "2025-11-20T17:39:29.941Z"}', '2025-11-20 17:39:29.946');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('1f0934e4-6642-4342-8b66-75f0b49a33bd', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "9098f62f-fb90-41c4-827c-7df1ebe554aa", "planName": "Free", "timestamp": "2025-11-20T17:39:37.187Z"}', '2025-11-20 17:39:37.191');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('9654a7ab-a70d-4c07-a95a-be24440bf582', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "3c3e814a-f8be-49fc-b69e-2e85037955e2", "planName": "Pro", "timestamp": "2025-11-20T17:39:41.802Z"}', '2025-11-20 17:39:41.805');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('ffe3dff3-3722-4b11-a94d-0cfa37a23dff', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "9098f62f-fb90-41c4-827c-7df1ebe554aa", "planName": "Free", "timestamp": "2025-11-20T17:39:45.138Z"}', '2025-11-20 17:39:45.141');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('219aeb61-feb7-4d94-bf56-3e319cc04e9b', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "3c3e814a-f8be-49fc-b69e-2e85037955e2", "planName": "Pro", "timestamp": "2025-11-20T17:39:46.796Z"}', '2025-11-20 17:39:46.799');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('c12d3d49-70f1-448a-99e1-07487fe3e183', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "9098f62f-fb90-41c4-827c-7df1ebe554aa", "planName": "Free", "timestamp": "2025-11-20T17:48:38.919Z"}', '2025-11-20 17:48:38.92');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('739bc13d-0fe9-4b61-9110-eaba9618ba7f', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "3c3e814a-f8be-49fc-b69e-2e85037955e2", "planName": "Pro", "timestamp": "2025-11-20T17:48:42.308Z"}', '2025-11-20 17:48:42.309');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('1cd7d7bf-6859-472c-86e0-1636084b8291', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "9098f62f-fb90-41c4-827c-7df1ebe554aa", "planName": "Free", "timestamp": "2025-11-20T17:48:43.314Z"}', '2025-11-20 17:48:43.315');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('3d45ca05-d72f-4159-a545-02e9813fd994', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "3c3e814a-f8be-49fc-b69e-2e85037955e2", "planName": "Pro", "timestamp": "2025-11-20T17:49:12.041Z"}', '2025-11-20 17:49:12.043');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('9f61cd3a-e607-4c1a-a4dc-cd33d030bb19', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "9098f62f-fb90-41c4-827c-7df1ebe554aa", "planName": "Free", "timestamp": "2025-11-20T17:49:13.671Z"}', '2025-11-20 17:49:13.672');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('19895ee7-2c86-4219-8b9c-64ff8c5e7366', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "3c3e814a-f8be-49fc-b69e-2e85037955e2", "planName": "Pro", "timestamp": "2025-11-20T17:51:24.400Z"}', '2025-11-20 17:51:24.402');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('d79fbbd7-531e-4706-bfd9-007655548913', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "9098f62f-fb90-41c4-827c-7df1ebe554aa", "planName": "Free", "timestamp": "2025-11-20T17:51:26.794Z"}', '2025-11-20 17:51:26.796');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('012ab948-726d-443e-8666-e10a20ed4849', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'plan_upgrade', '{"planId": "3c3e814a-f8be-49fc-b69e-2e85037955e2", "planName": "Pro", "timestamp": "2025-11-20T17:51:27.876Z"}', '2025-11-20 17:51:27.878');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('91bd53c9-44ba-411e-a678-d0e23a20b954', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'dashboard_delete', '{"dashboardId": "1fbe2c8d-ff13-49f1-9ab2-bdeb55388c95"}', '2025-11-20 18:21:54.805');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('7ed46002-896d-446f-9f9b-f853dfb54a63', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'dashboard_create', '{"name": "test", "dashboardId": "b587bd0a-5e67-409f-8d5d-7b33c36ef079"}', '2025-11-20 18:22:01.78');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('d11ba170-5c8b-4ab2-91a2-10e0c83464d3', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'user_logout', '{"timestamp": "2025-11-24T13:48:34.166Z"}', '2025-11-24 13:48:34.169');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('0f56e9f9-72e0-4a62-a86f-c8b52b93232d', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'user_login', '{"timestamp": "2025-11-24T13:48:37.352Z"}', '2025-11-24 13:48:37.353');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('a37e8943-85c8-484a-8647-b62479412160', '7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'user_logout', '{"timestamp": "2025-11-24T13:48:41.420Z"}', '2025-11-24 13:48:41.421');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('2ed72ba2-172e-4be9-95c8-26f81f2ba129', '2371f083-5921-4d84-8403-2e46befe279e', 'user_signup', '{"email": "m@example.com"}', '2025-11-24 13:49:12.287');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('9196fecb-0174-4608-a1ee-feddf10b42b3', '2371f083-5921-4d84-8403-2e46befe279e', 'user_login', '{"timestamp": "2025-11-24T13:49:12.445Z"}', '2025-11-24 13:49:12.447');
INSERT INTO public.usage_logs (id, user_id, action, details, created_at) VALUES ('82011196-c952-4c0b-8f20-dad3dcb2b534', '2371f083-5921-4d84-8403-2e46befe279e', 'plan_upgrade', '{"planId": "3c3e814a-f8be-49fc-b69e-2e85037955e2", "planName": "Pro", "timestamp": "2025-11-24T13:49:36.633Z"}', '2025-11-24 13:49:36.634');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, email, password, full_name, plan_id, created_at, updated_at) VALUES ('9c5b0124-897a-4c32-a915-3dece8987b3f', 'test@example.com', '$2b$10$N.ERczlYPG0V06HOi0V.X.V32JGgfsZyDnrFH5g7DtTafD9OOvjJa', 'Test User', '9098f62f-fb90-41c4-827c-7df1ebe554aa', '2025-11-19 13:50:29.715', '2025-11-19 13:50:29.715');
INSERT INTO public.users (id, email, password, full_name, plan_id, created_at, updated_at) VALUES ('04a7e08b-00c7-435e-b1d6-e77685e3ad8a', 'testuser@example.com', '$2b$10$MQg4ueN/XuaNC45jpr4my.Ak86DE0fNiy8jx/fG8PrwZJYL6YofPi', NULL, '9098f62f-fb90-41c4-827c-7df1ebe554aa', '2025-11-19 20:07:54.935', '2025-11-19 20:07:54.935');
INSERT INTO public.users (id, email, password, full_name, plan_id, created_at, updated_at) VALUES ('7c8ce0c5-c958-4a30-9d9a-841f6f5f033c', 'asdasda@gmail.com', '$2b$10$R7jH9MQJE/DHCmXfuiV/9.M3hBLj7ebhmwhwkka8q9hmu3sje6TqC', 'test', '3c3e814a-f8be-49fc-b69e-2e85037955e2', '2025-11-19 14:13:56.749', '2025-11-20 17:51:27.871');
INSERT INTO public.users (id, email, password, full_name, plan_id, created_at, updated_at) VALUES ('2371f083-5921-4d84-8403-2e46befe279e', 'm@example.com', '$2b$10$OrF96ZCrQzsUQne8gCbmuOH2rFbRF2rul3hD3IVbQvywgvUM2jER6', '123', '3c3e814a-f8be-49fc-b69e-2e85037955e2', '2025-11-24 13:49:12.281', '2025-11-24 13:49:36.621');


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: charts charts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charts
    ADD CONSTRAINT charts_pkey PRIMARY KEY (id);


--
-- Name: dashboards dashboards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboards
    ADD CONSTRAINT dashboards_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: usage_logs usage_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_logs
    ADD CONSTRAINT usage_logs_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: charts_dashboard_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX charts_dashboard_id_idx ON public.charts USING btree (dashboard_id);


--
-- Name: dashboards_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX dashboards_user_id_idx ON public.dashboards USING btree (user_id);


--
-- Name: files_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX files_user_id_idx ON public.files USING btree (user_id);


--
-- Name: plans_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX plans_name_key ON public.plans USING btree (name);


--
-- Name: usage_logs_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX usage_logs_created_at_idx ON public.usage_logs USING btree (created_at);


--
-- Name: usage_logs_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX usage_logs_user_id_idx ON public.usage_logs USING btree (user_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: charts charts_dashboard_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charts
    ADD CONSTRAINT charts_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: charts charts_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.charts
    ADD CONSTRAINT charts_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: dashboards dashboards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dashboards
    ADD CONSTRAINT dashboards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: files files_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: usage_logs usage_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_logs
    ADD CONSTRAINT usage_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict YNs9QllMrkymjFw9SeoWDxcRYIyNkX2bVEIp9RGYWgnTfbFRzPJ6Qp6PvbhEJoB

