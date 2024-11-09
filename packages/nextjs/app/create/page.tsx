"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

type Candidate = {
  name: string;
};

type Inputs = {
  title: string;
  candidates: Candidate[];
  end_time: string;
};

export default function Create() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      candidates: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "candidates",
  });

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setLoading(true);
    const isoEndTime = new Date(data.end_time).toISOString();
    const formattedData = { ...data, end_time: isoEndTime };

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${API_URL}/elections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        router.push(`/election/${result.id}`);
      } else {
        console.error("Failed to create election");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200 p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-base-100 p-8 rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-primary text-center mb-4">Create New Election</h2>

        {/* Election Title */}
        <div className="form-control">
          <label htmlFor="title" className="label">
            <span className="label-text">Election Title</span>
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter election title"
            className="input input-bordered w-full"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Election Expiry Date */}
        <div className="form-control">
          <label htmlFor="end_time" className="label">
            <span className="label-text">Election Expiry Date</span>
          </label>
          <input
            type="datetime-local"
            id="end_time"
            className="input input-bordered w-full"
            {...register("end_time", { required: "End time is required" })}
          />
          {errors.end_time && <p className="text-red-500 mt-1">{errors.end_time.message}</p>}
        </div>

        {/* Candidates List */}
        <div className="form-control">
          <h3 className="label-text text-lg font-semibold mb-2">Candidates</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder={`Candidate ${index + 1}`}
                className="input input-bordered grow"
                {...register(`candidates.${index}.name` as const, { required: "Candidate name is required" })}
              />
              <button type="button" className="btn btn-error" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-accent w-full mt-2" onClick={() => append({ name: "" })}>
            Add Candidate
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit" className={`btn btn-primary w-full ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "Creating..." : "Create Election"}
        </button>
      </form>
    </div>
  );
}
