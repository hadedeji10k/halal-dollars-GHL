"use client";
import React, { useState } from "react";
import Input from "../components/Input";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { countries, timezones } from "@/utils/constant";
import { useRouter } from "next/router";

const PaystackHookExample = dynamic(() => import("@/components/Paystack"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const [showPaystack, setShowPaystack] = useState(false);
  const [config, setConfig] = useState({
    reference: new Date().getTime().toString(),
    email: "",
    amount: process.env.NEXT_PUBLIC_PAYMENT_AMOUNT || 3060000,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    metadata: {},
  });

  const registerSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last Name is required"),
    name: Yup.string().required("Full name is required"),
    address: Yup.string().required("Address is required"),
    phone: Yup.string().required("Phone is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    postalCode: Yup.string().required("Postal code is required"),
    website: Yup.string()
      .matches(
        /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i,
        "Enter a valid website URL"
      )
      .required("Website URL is required"),
    timezone: Yup.string().required("Time zone is required"),
  });
  const initialValues = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    name: "",
    city: "",
    state: "",
    address: "",
    phone: "",
    country: "NG",
    postalCode: "",
    website: "",
    timezone: "Africa/Lagos",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      const res = await fetch("/api/create-transaction", {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phone,
          amount: config.amount,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        Swal.fire({
          title: "Error!",
          text: "An error occurred while processing your request",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      } else {
        const data = await res.json();
        setConfig({
          ...config,
          reference: data.id,
          email: values.email,
          metadata: {
            custom_fields: [
              {
                display_name: "Email",
                variable_name: "email",
                value: values.email,
              },
              {
                display_name: "First name",
                variable_name: "firstName",
                value: values.firstName,
              },
              {
                display_name: "Last name",
                variable_name: "lastName",
                value: values.lastName,
              },
            ],
            ...values,
          },
        });
        setShowPaystack(true);
      }
      return;
    },
  });

  const onSuccess = (reference: string) => {
    setShowPaystack(false);
    Swal.fire({
      title: "Success!",
      text: "Congratulations!!! You've successfully purcahsed a GoHighLevel account. You will receive an email shortly.",
      icon: "success",
      confirmButtonText: "Ok",
    }).finally(() => {
      router.reload();
    });
  };
  const onClose = () => {
    formik.setSubmitting(false);
    setShowPaystack(false);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col bg-[#f2f4f7] p-10 min-h-[calc(100vh-78px)]">
        <Loader spinning={formik.isSubmitting}>
          <div className="flex flex-col max-w-[600px] mx-auto items-center text-center">
            <h3 className="text-[#001f5c] text-3xl font-bold mb-2">
              Purchase GoHighLevel Account
            </h3>
            <p className="text-[#475467] text-lg font-semibold mb-5">
              Pay and get a GoHighLevel account for yourself today!
            </p>

            <div className="w-full">
              <Input
                className="max-w-full"
                label="Email address"
                defaultValue={formik.values.email}
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="h@gmail.com"
                disabled={formik.isSubmitting || showPaystack}
                error={formik.touched.email && formik.errors.email}
              />
              <Input
                className="max-w-full"
                label="Password"
                defaultValue={formik.values.password}
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="********"
                disabled={formik.isSubmitting || showPaystack}
                error={formik.touched.password && formik.errors.password}
                type="password"
              />
              <Input
                className="max-w-full"
                label="First Name"
                defaultValue={formik.values.firstName}
                name="firstName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="John"
                disabled={formik.isSubmitting || showPaystack}
                error={formik.touched.firstName && formik.errors.firstName}
              />
              <Input
                className="max-w-full"
                label="last Name"
                defaultValue={formik.values.lastName}
                name="lastName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Doe"
                disabled={formik.isSubmitting || showPaystack}
                error={formik.touched.lastName && formik.errors.lastName}
              />
              <Input
                className="max-w-full"
                label="Full Name"
                defaultValue={formik.values.name}
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="John doe"
                disabled={formik.isSubmitting || showPaystack}
                error={formik.touched.name && formik.errors.name}
              />
              <Input
                className="max-w-full"
                label="Address"
                defaultValue={formik.values.address}
                name="address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Lagos, Nigeria"
                disabled={formik.isSubmitting || showPaystack}
                error={formik.touched.address && formik.errors.address}
              />
              <Input
                className="max-w-full"
                label="City"
                defaultValue={formik.values.city}
                name="city"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ikeja"
                disabled={formik.isSubmitting || showPaystack}
                error={formik.touched.city && formik.errors.city}
              />
              <Input
                className="max-w-full"
                label="State"
                defaultValue={formik.values.state}
                name="state"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Lagos"
                disabled={formik.isSubmitting || showPaystack}
                error={formik.touched.state && formik.errors.state}
              />
              <div className="mt-3">
                <label className="text-[15px] text-[#344054] flex gap-2 items-center font-medium mb-[2px]">
                  Country
                </label>
                <Select
                  size="small"
                  className="max-w-full w-full text-left"
                  id="demo-select-small"
                  value={formik.values.country}
                  onChange={(event: SelectChangeEvent) => {
                    console.log("vcal?", event.target.value);
                    formik.setFieldValue("country", event.target.value);
                    formik.setFieldTouched("country", true);
                  }}
                  disabled={formik.isSubmitting || showPaystack}
                >
                  {countries.map((value, index) => (
                    <MenuItem value={value.code} key={index}>
                      {value.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <Input
                className="max-w-full"
                label="Phone number"
                defaultValue={formik.values.phone}
                name="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="+23490000000000"
                disabled={formik.isSubmitting || showPaystack}
                error={formik.touched.phone && formik.errors.phone}
              />
              <Input
                className="max-w-full"
                label="Postal code"
                defaultValue={formik.values.postalCode}
                name="postalCode"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="12345"
                disabled={formik.isSubmitting || showPaystack}
                error={formik.touched.postalCode && formik.errors.postalCode}
              />
              <Input
                className="max-w-full"
                label="Website URL"
                defaultValue={formik.values.website}
                name="website"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="halal-dollars.ng"
                disabled={formik.isSubmitting || showPaystack}
                error={formik.touched.website && formik.errors.website}
              />
              <div className="mt-3">
                <label className="text-[15px] text-[#344054] flex gap-2 items-center font-medium mb-[2px]">
                  Timezone
                </label>
                <Select
                  size="small"
                  className="max-w-full w-full text-left"
                  id="demo-select-small"
                  value={formik.values.timezone}
                  onChange={(event: SelectChangeEvent) => {
                    formik.setFieldValue("timezone", event.target.value);
                    formik.setFieldTouched("timezone", true);
                  }}
                  disabled={formik.isSubmitting || showPaystack}
                >
                  {timezones.map((value, index) => (
                    <MenuItem value={value} key={index}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            {showPaystack ? (
              <PaystackHookExample
                onClose={onClose}
                onSuccess={onSuccess}
                config={config}
              />
            ) : (
              <button
                type="submit"
                onClick={(e) => formik.handleSubmit()}
                className="bg-[#003db8d7] text-[#f9f5ff] p-[10px_20px] border-none rounded-[5px] mt-[20px] cursor-pointer transition-all duration-300 hover:bg-[#0237a1]"
                disabled={formik.isSubmitting || showPaystack}
              >
                Pay
              </button>
            )}
          </div>
        </Loader>
      </div>
    </>
  );
}
