import { Field, Form, Formik } from "formik";
import SimpleTabs from "../../../../components/SimpleTabs";
import TextInput from "../../../../components/input";
import DropdownAPI from "../../../../components/dropdownapi";
import tahap1Store from "./store/tahap1store";
import Button from "../../../../components/button";
import { useRouter } from "next/router";

const ManualForm = ({
  initialValues = {
    kodeRup: "",
    namaBalai: {},
    namaPaket: "",
    namaPpk: "",
    jabatanPpk: "",
  },
  hide = true,
  balaiOptions = [],
}) => {
  const { setSelectedTab, submitManual } = tahap1Store();

  console.log(initialValues);

  const router = useRouter();

  return (
    <div className={`${hide ? "hidden" : ""}`}>
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center">
          <SimpleTabs
            items={["Sinkron data dari SIPASTI", "Input Manual"]}
            selectedValue={1}
            onChange={(tabIndex) => setSelectedTab(tabIndex)}
          />
        </div>
      </div>
      <div className="">
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            const isSuccess = await submitManual(values);
            if (isSuccess) {
              router.push("/perencanaan_data/tahap2");
            }
          }}
          enableReinitialize={true}
        >
          <Form>
            <div className="mt-3 bg-neutral-100 px-6 py-8 rounded-[16px] space-y-8">
              <Field name="kodeRup" type="input">
                {({ field, form }) => (
                  <div className="flex flex-row items-center space-x-4">
                    <TextInput
                      {...field}
                      label="Kode RUP"
                      labelPosition="left"
                      placeholder="Masukkan Kode RUP"
                      size="Medium"
                      errorMessage="Kode RUP tidak boleh kosong"
                      onChange={(e) =>
                        form.setFieldValue(field.name, e.target.value)
                      }
                    />
                  </div>
                )}
              </Field>
              <Field name="namaBalai" type="dropdown">
                {({ field, form }) => {
                  return (
                    <div className="flex flex-row items-center space-x-4">
                      <label
                        className={`text-B2 text-emphasis-on_surface-high h-8 min-w-[430px] mr-2 flex items-center`}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Nama Balai
                        <span className="text-custom-red-500 ml-1">*</span>
                      </label>
                      <DropdownAPI
                        {...field}
                        label="Nama Balai"
                        labelPosition="left"
                        placeholder="Pilih Nama Balai"
                        size="Medium"
                        isRequired="true"
                        errorMessage="Nama Balai tidak boleh kosong"
                        options={balaiOptions}
                        value={
                          Object.keys(field?.value ?? {}).length === 0
                            ? null
                            : field.value
                        }
                        onChange={(e) => form.setFieldValue(field.name, e)}
                      />
                    </div>
                  );
                }}
              </Field>
              <Field name="namaPaket" type="input">
                {({ field, form }) => (
                  <div className="flex flex-row items-center space-x-4">
                    <TextInput
                      {...field}
                      label="Nama Paket"
                      labelPosition="left"
                      placeholder="Masukkan Nama Paket"
                      size="Medium"
                      isRequired="true"
                      errorMessage="Nama Paket tidak boleh kosong"
                      onChange={(e) =>
                        form.setFieldValue(field.name, e.target.value)
                      }
                    />
                  </div>
                )}
              </Field>
              <Field name="namaPpk" type="input">
                {({ field, form }) => (
                  <div className="flex flex-row items-center space-x-4">
                    <TextInput
                      {...field}
                      label="Nama PPK"
                      labelPosition="left"
                      placeholder="Masukkan Nama PPK"
                      size="Medium"
                      isRequired="true"
                      errorMessage="Nama PPK tidak boleh kosong"
                      onChange={(e) =>
                        form.setFieldValue(field.name, e.target.value)
                      }
                    />
                  </div>
                )}
              </Field>
              <Field name="jabatanPpk" type="input">
                {({ field, form }) => (
                  <div className="flex flex-row items-center space-x-4">
                    <TextInput
                      {...field}
                      label="Jabatan PPK"
                      labelPosition="left"
                      placeholder="Masukkan Jabatan PPK"
                      size="Medium"
                      isRequired="true"
                      errorMessage="Jabatan PPK tidak boleh kosong"
                      onChange={(e) =>
                        form.setFieldValue(field.name, e.target.value)
                      }
                    />
                  </div>
                )}
              </Field>
            </div>
            <div className="flex flex-row justify-end items-right space-x-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
              <Button
                type="button"
                variant="outlined_yellow"
                size="Medium"
                onClick={() => {}}
              >
                Kembali
              </Button>
              <Button
                type="submit"
                variant="solid_blue"
                size="Medium"
                onClick={() => {}}
              >
                Lanjut
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ManualForm;
