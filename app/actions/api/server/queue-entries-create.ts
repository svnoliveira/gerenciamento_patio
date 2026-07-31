// "use server";

// import { serverApiFetch } from "@/app/actions/api/server/serverApiFetch";

// import { QueueEntryFormOutput } from "@/app/components/QueueEntryForm/schema";
// import { getApiErrorMessage } from "@/lib/getApiErrorMessage";
// import { newOrder } from "./queue-entries";

// export async function createQueueEntry(
//   values: QueueEntryFormOutput,
//   photo: File,
// ) {
//   const formData = new FormData();

//   formData.append("company_name", values.company_name);
//   formData.append("truck_plate", values.truck_plate);
//   formData.append("truck_driver", values.truck_driver);
//   formData.append("truck_cpf", values.truck_cpf);
//   formData.append("truck_cellphone", values.truck_cellphone);
//   formData.append("truck_product", values.truck_product);
//   formData.append("truck_type", values.truck_type);
//   formData.append("job", values.job);
//   formData.append("photo", photo, photo.name);

//   const res = await serverApiFetch("/queue-entries/", {
//     method: "POST",
//     body: formData,
//   });

//   if (!res.ok)
//     throw new Error(
//       await getApiErrorMessage(res, "Falha ao registrar agendamento"),
//     );

//   const entry = await res.json();
//   await newOrder(entry.id);
//   return entry;
// }
