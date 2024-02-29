import { useFieldArray, useFormContext } from "react-hook-form";
import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { useCallback } from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const SocketConfigFields = () => {
  const { control } = useFormContext();

  const {
    fields: tcpAddresses,
    append: appendTcpAddress,
    remove: removeTcpAddress,
  } = useFieldArray({
    name: "tcpAddresses",
    control: control,
  });

  const appendDefaultTcpAddress = useCallback(() => {
    appendTcpAddress({});
  }, [appendTcpAddress]);

  const {
    fields: udpAddresses,
    append: appendUdpAddress,
    remove: removeUdpAddress,
  } = useFieldArray({
    name: "udpAddresses",
    control: control,
  });

  const appendDefaultUdpAddress = useCallback(() => {
    appendUdpAddress({});
  }, [appendUdpAddress]);

  return (
    <div>
      <div className="mt-4">TCP Addresses</div>
      <div>
        {tcpAddresses.map((tcp, index) => (
          <div key={tcp.id}>
            <div className="flex justify-end items-center mt-2">
              <div
                onClick={() => removeTcpAddress(index)}
                className="cursor-pointer"
              >
                <DeleteIcon color="error" />
              </div>
            </div>
            <div className="flex mt-2 gap-2">
              <div className="w-[75%]">
                <FormTextField
                  name={`tcpAddresses.${index}.local.ip`}
                  label="Local IP"
                />
              </div>
              <div className="w-[25%]">
                <FormTextField
                  name={`tcpAddresses.${index}.local.port`}
                  label="Port"
                  type="number"
                />
              </div>
            </div>
            <div className="flex mt-4 gap-2">
              <div className="w-[75%]">
                <FormTextField
                  name={`tcpAddresses.${index}.remote.ip`}
                  label="Remote IP"
                />
              </div>
              <div className="w-[25%]">
                <FormTextField
                  name={`tcpAddresses.${index}.remote.port`}
                  label="Port"
                  type="number"
                />
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4">
          <Button onClick={appendDefaultTcpAddress} variant="contained">
            ADD TCP
          </Button>
        </div>
      </div>
      <div className="mt-4">UDP Addresses</div>
      <div>
        {udpAddresses.map((tcp, index) => (
          <div key={tcp.id}>
            <div className="flex justify-end items-center mt-2">
              <div
                onClick={() => removeUdpAddress(index)}
                className="cursor-pointer"
              >
                <DeleteIcon color="error" />
              </div>
            </div>
            <div className="flex mt-2 gap-2">
              <div className="w-[75%]">
                <FormTextField
                  name={`udpAddresses.${index}.local.ip`}
                  label="Local IP"
                />
              </div>
              <div className="w-[25%]">
                <FormTextField
                  name={`udpAddresses.${index}.local.port`}
                  label="Port"
                  type="number"
                />
              </div>
            </div>
            <div className="flex mt-4 gap-2">
              <div className="w-[75%]">
                <FormTextField
                  name={`udpAddresses.${index}.remote.ip`}
                  label="Remote IP"
                />
              </div>
              <div className="w-[25%]">
                <FormTextField
                  name={`udpAddresses.${index}.remote.port`}
                  label="Port"
                  type="number"
                />
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4">
          <Button onClick={appendDefaultUdpAddress} variant="contained">
            ADD UDP
          </Button>
        </div>
      </div>
    </div>
  );
};
