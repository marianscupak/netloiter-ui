import { FormTextField } from "../../wrapped-inputs/form-text-field";

export const SocketTcpFields = () => (
  <div>
    <div className="flex mt-4 gap-2">
      <div className="w-[75%]">
        <FormTextField name="ip" label="IP" />
      </div>
      <div className="w-[25%]">
        <FormTextField name="port" label="Port" type="number" />
      </div>
    </div>
    <div className="mt-4">
      <FormTextField name="packFormat" label="Pack format" />
    </div>
    <div className="mt-4">
      <FormTextField name="mark" label="Mark" />
    </div>
    <div className="mt-4">
      <div>Format</div>
      <div className="border px-4 pb-4">
        <div className="mt-4">
          <FormTextField name="format.meta" label="Meta" />
        </div>
        <div className="mt-4">
          <FormTextField name="format.data" label="Data" />
        </div>
        <div className="mt-4">
          <FormTextField name="format.type" label="Type" />
        </div>
      </div>
    </div>
  </div>
);
