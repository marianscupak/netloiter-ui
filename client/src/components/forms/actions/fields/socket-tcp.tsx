import { FormTextField } from "../../wrapped-inputs/form-text-field";
import { FieldNamePrefix } from "../../field-name-prefix";

interface Props extends FieldNamePrefix {
  disabled?: boolean;
}

export const SocketTcpFields = ({ fieldNamePrefix, disabled }: Props) => (
  <div>
    <div className="flex mt-4 gap-2">
      <div className="w-[75%]">
        <FormTextField
          name={fieldNamePrefix ? `${fieldNamePrefix}.ip` : "ip"}
          label="IP"
          disabled={disabled}
        />
      </div>
      <div className="w-[25%]">
        <FormTextField
          name={fieldNamePrefix ? `${fieldNamePrefix}.port` : "port"}
          label="Port"
          type="number"
          disabled={disabled}
          int
        />
      </div>
    </div>
    <div className="mt-4">
      <FormTextField
        name={fieldNamePrefix ? `${fieldNamePrefix}.packFormat` : "packFormat"}
        label="Pack format"
        disabled={disabled}
      />
    </div>
    <div className="mt-4">
      <FormTextField
        name={fieldNamePrefix ? `${fieldNamePrefix}.mark` : "mark"}
        label="Mark"
        disabled={disabled}
        type="number"
        int
      />
    </div>
    {/*<div className="mt-4">*/}
    {/*  <div>Format</div>*/}
    {/*  <div className="border px-4 pb-4">*/}
    {/*    <div className="mt-4">*/}
    {/*      <FormTextField*/}
    {/*        name={*/}
    {/*          fieldNamePrefix ? `${fieldNamePrefix}.format.meta` : "format.meta"*/}
    {/*        }*/}
    {/*        label="Meta"*/}
    {/*        disabled={disabled}*/}
    {/*      />*/}
    {/*    </div>*/}
    {/*    <div className="mt-4">*/}
    {/*      <FormTextField*/}
    {/*        name={*/}
    {/*          fieldNamePrefix ? `${fieldNamePrefix}.format.data` : "format.data"*/}
    {/*        }*/}
    {/*        label="Data"*/}
    {/*        disabled={disabled}*/}
    {/*      />*/}
    {/*    </div>*/}
    {/*    <div className="mt-4">*/}
    {/*      <FormTextField*/}
    {/*        name={*/}
    {/*          fieldNamePrefix ? `${fieldNamePrefix}.format.type` : "format.type"*/}
    {/*        }*/}
    {/*        label="Type"*/}
    {/*        disabled={disabled}*/}
    {/*      />*/}
    {/*    </div>*/}
    {/*  </div>*/}
    {/*</div>*/}
  </div>
);
