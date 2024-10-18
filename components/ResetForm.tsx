/* eslint-disable prettier/prettier */
'use client'

import Link from "next/link"
import { button as buttonStyles } from "@nextui-org/theme";
import { Input } from "@nextui-org/input";
import { Eye, EyeOff } from "lucide-react";
import { Image } from "@nextui-org/image";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useFormState, useFormStatus } from "react-dom";
import clsx from "clsx";
// import { io } from "socket.io-client";

import { IEmployees, IResetPassword } from "@/app/types"
import { pinReset } from "@/app/reset/actions";


const initialState: IResetPassword = {
    fieldValues: {
        username: "",
        ipaddress: "",
        new: "",
        old: "",
        confirm: ""
    },
    error: "",
    reset: false,
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
                size: "md",
                fullWidth: true,
            })}
            isDisabled={pending}
            type="submit"
        >
            {pending ? "Submiting..." : "Reset Password"}
        </Button>
    );
}

export default function ResetForm({ data }: { data: IEmployees[] }) {
    const [state, formAction] = useFormState(pinReset, initialState)
    const [message, setMessage] = useState("")
    const [isAvailable, setIsAvailable] = useState(false);
    const [isVisibleOld, setIsVisibleOld] = useState(false);
    const [isVisibleNew, setIsVisibleNew] = useState(false);
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
    const formRef = useRef<HTMLFormElement>(null)

    const [ipaddress, setIpAddress] = useState("")

    const [value, setValue] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        setMessage(state.error)
    }, [state.error])


    // Fetch IP address once when component mounts
    useEffect(() => {
        const fetchIpAddress = async () => {
            try {
                const response = await fetch('https://api.ipify.org/?format=json');

                if (response.ok) {
                    const data = await response.json();

                    setIpAddress(data.ip);
                } else {
                    throw new Error('Failed to fetch IP address');
                }
            } catch (error) {
                throw new Error(`Error fetching IP address: ${error}`);
            }
        };

        fetchIpAddress();
    }, []);

    // Reset form state if needed

    useEffect(() => {
        if (state.reset) {
            formRef.current?.reset();
            // state.error = "";
        }
    }, [state.reset]);

    const toggleVisibilityOld = useCallback(() => setIsVisibleOld(prev => !prev), []);
    const toggleVisibilityNew = useCallback(() => setIsVisibleNew(prev => !prev), []);
    const toggleVisibilityConfirm = useCallback(() => setIsVisibleConfirm(prev => !prev), []);

    const handleUsernameChange = useCallback((event: any) => {
        const userInput = event.target.value;
        const userAvailable = data.find((x) => x.Employee_Username === userInput);

        setIsAvailable(!userAvailable);
    }, [data]);


    const isInvalid = useMemo(() => {
        if (value === "") return false;

        return value !== newPassword;
    }, [value]);


    const errors = ["Failed to parse form data", "Invalid IP address", "User not found", "Incorrect old password", "Failed to update", "Internal Server Error"]

    return (
        <Card className="flex flex-col items-center justify-center gap-2 p-10">
            <CardHeader className="flex flex-col gap-3 w-full max-w-sm text-center items-center justify-center p-0 relative">
                <Image
                    alt="Zanda Logo"
                    className="p-0"
                    src="/logo-dark.png"
                    width={100}
                />

            </CardHeader>
            <p className={clsx("text-xs font-bold",
                errors.find(x => x === message) ? "text-red-500" : "text-green-500"
            )}>{message}</p>
            <form
                ref={formRef} action={formAction}
                className="flex flex-col items-center justify-center gap-3"
            >
                <CardBody className="max-w-sm flex flex-col items-center justify-center gap-2 p-0">
                    <input defaultValue={ipaddress} id="ipaddress" name="ipaddress" type="hidden" />
                    <Input
                        isRequired
                        aria-label="username"
                        autoComplete="off"
                        classNames={{
                            inputWrapper: "bg-default-100",
                            input: "text-sm",
                        }}
                        errorMessage="User not found"
                        id="username"
                        isInvalid={isAvailable}
                        label="Username"
                        name="username"
                        size="sm"
                        type="text"
                        onChange={handleUsernameChange}
                    />
                    <Input
                        isRequired
                        aria-label="oldPass"
                        classNames={{
                            inputWrapper: "bg-default-100",
                            input: "text-sm",
                        }}
                        endContent={
                            <button type="button" onClick={toggleVisibilityOld}>
                                {isVisibleOld ? (
                                    <EyeOff className="text-default-400 pointer-events-none" />
                                ) : (
                                    <Eye className="text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        id="oldPass"
                        label="Old Password"
                        name="oldPass"
                        size="sm"
                        type={isVisibleOld ? "text" : "password"}
                    />
                    <Input
                        isRequired
                        aria-label="newPass"
                        classNames={{
                            inputWrapper: "bg-default-100",
                            input: "text-sm",
                        }}
                        endContent={
                            <button type="button" onClick={toggleVisibilityNew}>
                                {isVisibleNew ? (
                                    <EyeOff className="text-default-400 pointer-events-none" />
                                ) : (
                                    <Eye className="text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        errorMessage="Password not match"
                        id="newPass"
                        label="New Password"
                        name="newPass"
                        size="sm"
                        type={isVisibleNew ? "text" : "password"}
                        value={newPassword}
                        onValueChange={setNewPassword}
                    />
                    <Input
                        isRequired
                        aria-label="confirm"
                        classNames={{
                            inputWrapper: "bg-default-100",
                            input: "text-sm",
                        }}
                        endContent={
                            <button type="button" onClick={toggleVisibilityConfirm}>
                                {isVisibleConfirm ? (
                                    <EyeOff className="text-default-400 pointer-events-none" />
                                ) : (
                                    <Eye className="text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        errorMessage="Password not match"
                        id="confirm"
                        isInvalid={isInvalid}
                        label="Confirm Password"
                        name="confirm"
                        size="sm"
                        type={isVisibleConfirm ? "text" : "password"}
                        value={value}
                        onValueChange={setValue}
                    />

                    <div className="w-full flex justify-around">
                        <Link className="text-xs" color="primary" href="/">
                            Time In / Time Out
                        </Link>
                        <button className="text-xs" type="button" onClick={() => { formRef.current?.reset(); }}>
                            Reset Form
                        </button>
                    </div>
                </CardBody>
                <SubmitButton />
            </form>
        </Card>
    );
}
