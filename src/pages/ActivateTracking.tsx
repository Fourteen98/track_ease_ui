import React, {useEffect, useState} from "react";

import {Button, Input, message, Steps, theme} from 'antd';
import Maps from "../components/Maps.tsx";
import MapActions from "../utils/actions";
import useCustomFetch from "../utils/useCustomFetch.ts";

export const ActivateTracking: React.FC = () => {
    const {token} = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [destinationAddress, setDestinationAddress] = useState("");
    const [sourceAddress, setSourceAddress] = useState("");
    const [parcelId, setParcelId] = useState("");
    const [trackEaseId, setTrackEaseId] = useState("");

    const fetchParcel = useCustomFetch(async () =>
            MapActions.createParcel({tracking_number: parcelId, departure_address: sourceAddress, destination_address: destinationAddress, current_status:"pending"}),
    false,
    (data: any) => {
        message.success(data.message);
        setCurrent(current + 1);
        // setParcelId(data);
    });


    const next = () => {
        if (current === 0) {
            if (destinationAddress === "" || sourceAddress === "") {
                message.error("Please fill in all fields");
            } else if (destinationAddress === sourceAddress) {
                message.error("Source and Destination cannot be the same");
            } else {
                setCurrent(current + 1);
                message.success("Source and Destination set successfully")
            }
        }
        if (current === 1) {
            if (parcelId === "") {
                message.error("Please fill in all fields");
            } else {
                fetchParcel.triggerFetch();
            }
        }

    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const destinationContent = (
        <div className="flex gap-x-8 justify-evenly items-center">
            <div>
                <Input className="w-full p-4" value={sourceAddress ? sourceAddress : ""} placeholder="Source Address" onChange={(e)=> setSourceAddress(e.target.value)}/>
            </div>
            <div>
                <Input className="w-full p-4" value={destinationAddress ? destinationAddress : ""} placeholder="Destination Address" onChange={(e)=> setDestinationAddress(e.target.value)}/>
            </div>
        </div>
    );

    const parcelContent = (
        <div className="flex gap-x-8 justify-evenly items-center">
            <div>
                <Input className="w-full p-4" value={parcelId ? parcelId : ""} placeholder="Parcel Tracking ID" onChange={(e)=> setParcelId(e.target.value)}/>
            </div>

        </div>
    );

    const steps = [
        {
            title: 'Destinations',
            content: destinationContent,
        },
        {
            title: 'Parcel',
            content: parcelContent,
        },
        {
            title: 'Tracking',
            content: <Maps />,
        },
    ];

    const items = steps.map((item) => ({key: item.title, title: item.title}));

    const contentStyle: React.CSSProperties = {
        lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `8px dashed ${token.colorBorder}`,
        marginTop: 16,
    };
    return (
        <div className="h-screen bg-[#d3cbba] overflow-x-scroll">
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#9da096] to-[#4c847f] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
            </div>
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <div className={""}>
                    <Steps current={current} items={items}/>
                    <div style={contentStyle}>{steps[current].content}</div>
                    <div style={{marginTop: 24}}>
                        {current < steps.length - 1 && (
                            <Button className={"text-white bg-[#587e7d]"} onClick={() => next()}>
                                Next
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button className={"text-white bg-[#587e7d]"} onClick={() => message.success('Processing complete!')}>
                                Done
                            </Button>
                        )}
                        {current > 0 && (
                            <Button style={{margin: '0 8px'}} className={"text-white  bg-[#587e7d]"} onClick={() => prev()}>
                                Previous
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}