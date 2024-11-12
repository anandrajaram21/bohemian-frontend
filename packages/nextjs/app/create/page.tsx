"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

type Candidate = {
  name: string;
};

type Inputs = {
  title: string;
  candidates: Candidate[];
  end_time: string;
  voter_emails: string[];
  voting_system: string;
};

export default function Create() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]); // State to store parsed emails
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      candidates: [{ name: "" }],
      voting_system: "traditional",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "candidates",
  });

  // Function to handle file upload and parse CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null); // Reset file error

    if (file && file.type === "text/csv") {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (result: any) => {
          const parsedEmails = result.data.map((row: string[]) => row[0].trim());
          validateEmails(parsedEmails);
        },
        error: error => {
          setFileError("Failed to parse CSV file.");
          console.error("Error parsing CSV:", error);
        },
      });
    } else {
      setFileError("Please upload a valid CSV file.");
    }
  };

  // Function to validate emails
  const validateEmails = (parsedEmails: string[]) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = parsedEmails.filter(email => emailRegex.test(email));

    if (validEmails.length === parsedEmails.length) {
      setEmails(validEmails);
      toast.success("Emails uploaded successfully.");
    } else {
      setFileError("CSV contains invalid email addresses.");
      setEmails([]); // Reset emails if there’s an invalid email
    }
  };

  const addEmail = () => {
    setEmails([...emails, ""]);
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, newEmail: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = newEmail;
    setEmails(updatedEmails);
  };

  const onSubmit: SubmitHandler<Inputs> = async data => {
    // Check if there are at least two candidates
    if (data.candidates.length < 2) {
      setError("candidates", { type: "manual", message: "Please add at least two candidates." });
      return;
    }

    if (emails.length === 0) {
      setFileError("Please upload a CSV file with valid emails.");
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading("Creating election, please wait...");

    const isoEndTime = new Date(data.end_time).toISOString();
    const formattedData = { ...data, end_time: isoEndTime, voter_emails: emails }; // Include emails array in payload

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
        toast.success("Election created successfully!", { id: loadingToastId });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for toast to show
        router.push(`/election/${result.id}`);
      } else {
        console.error("Failed to create election");
        toast.error("Failed to create election. Please try again.", { id: loadingToastId });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.", { id: loadingToastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200 p-8">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-1 text-primary hover:text-primary-focus"
        >
          <ArrowLeftIcon className="h-6 w-6" />
          <span>Back to Home</span>
        </button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-base-100 p-8 rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-primary text-center mb-4">Create New Election</h2>

        {/* Election Title */}
        <div className="form-control">
          <label htmlFor="title" className="label">
            <span className="label-text text-lg font-semibold">Election Title</span>
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

        {/* Voting System Selection */}
        <div className="form-control">
          <label htmlFor="voting_system" className="label">
            <span className="label-text font-semibold text-lg">Select Voting System</span>
          </label>
          <select
            id="voting_system"
            className="select select-bordered w-full"
            {...register("voting_system", { required: "Please select a voting system" })}
          >
            <option value="traditional">Traditional Voting</option>
            <option value="ranked_choice">Ranked Choice Voting</option>
          </select>
          {errors.voting_system && <p className="text-red-500 mt-1">{errors.voting_system.message}</p>}
        </div>

        {/* Election Expiry Date */}
        <div className="form-control">
          <label htmlFor="end_time" className="label">
            <span className="label-text font-semibold text-lg">Election Expiry Date</span>
          </label>
          <input
            type="datetime-local"
            id="end_time"
            className="input input-bordered w-full"
            {...register("end_time", {
              required: "End time is required",
              validate: value => {
                const selectedDate = new Date(value);
                const currentDate = new Date();
                if (selectedDate <= currentDate) {
                  return "Please select a future date and time.";
                }
                return true;
              },
            })}
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
          {errors.candidates && <p className="text-red-500 mt-2">{errors.candidates.message}</p>}
        </div>

        {/* File Upload for Emails */}
        <div className="form-control">
          <label htmlFor="emails" className="label">
            <span className="label-text font-semibold text-lg">Upload Emails CSV</span>
          </label>
          <input
            type="file"
            id="emails"
            accept=".csv"
            onChange={handleFileUpload}
            className="file-input file-input-bordered w-full"
          />
          {fileError && <p className="text-red-500 mt-1">{fileError}</p>}
        </div>

        {/* Emails Table */}
        <div className="form-control">
          <h3 className="label-text font-semibold text-lg mb-2">Email List</h3>
          <table className="table w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={email}
                      onChange={e => updateEmail(index, e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </td>
                  <td>
                    <button onClick={() => removeEmail(index)} className="btn btn-error btn-sm">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addEmail} className="btn btn-accent w-full mt-2">
            Add Email
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
