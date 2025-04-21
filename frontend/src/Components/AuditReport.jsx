import React, { useState } from "react";
import { ChevronDown, Download, Search, Bell, User } from "lucide-react";
import Navbar from "./Navbar";
import { useAuth } from "../store/auth";

const AuditReport = () => {
  const { isLoggedIn, role_id } = useAuth();
  const [dateRange, setDateRange] = useState({
    start: "2023-01-01",
    end: "2023-12-31",
  });
  const [selectedEvent, setSelectedEvent] = useState("All");
  const [selectedTeam, setSelectedTeam] = useState("All");

  const auditData = [
    {
      id: 1,
      researcher: "Dr. Smith",
      date: "2023-05-15",
      event: "Tumor Detection",
      tumorType: "Glioblastoma",
      patientAge: 45,
      treatment: "Chemotherapy",
      accuracy: "95%",
    },
    {
      id: 2,
      researcher: "Dr. Johnson",
      date: "2023-05-14",
      event: "Image Analysis",
      tumorType: "Meningioma",
      patientAge: 52,
      treatment: "Surgery",
      accuracy: "92%",
    },
    {
      id: 3,
      researcher: "Dr. Williams",
      date: "2023-05-13",
      event: "Treatment Plan",
      tumorType: "Astrocytoma",
      patientAge: 38,
      treatment: "Radiation Therapy",
      accuracy: "88%",
    },
    {
      id: 4,
      researcher: "Dr. Brown",
      date: "2023-05-12",
      event: "Follow-up Scan",
      tumorType: "Oligodendroglioma",
      patientAge: 60,
      treatment: "Targeted Therapy",
      accuracy: "91%",
    },
    {
      id: 5,
      researcher: "Dr. Davis",
      date: "2023-05-11",
      event: "Tumor Detection",
      tumorType: "Ependymoma",
      patientAge: 29,
      treatment: "Immunotherapy",
      accuracy: "93%",
    },
  ];

  return (
    <>
      {isLoggedIn && role_id === "1" && (
        <>
          <div className="min-h-screen bg-gray-100 ">
            <div className="max-w-7xl mx-auto mt-8 p-4 ">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Activity
              </h1>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex space-x-4">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, start: e.target.value })
                      }
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, end: e.target.value })
                      }
                      className="border rounded px-2 py-1"
                    />
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option>Events: All</option>
                      <option>Tumor Detection</option>
                      <option>Image Analysis</option>
                      <option>Treatment Plan</option>
                      <option>Follow-up Scan</option>
                    </select>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option>Teams: All</option>
                      <option>Oncology</option>
                      <option>Radiology</option>
                      <option>Neurology</option>
                    </select>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    <Download className="inline-block mr-2" />
                    Request CSV
                  </button>
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-2">Researcher</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Event</th>
                      <th className="text-left p-2">Tumor Type</th>
                      <th className="text-left p-2">Patient Age</th>
                      <th className="text-left p-2">Treatment</th>
                      <th className="text-left p-2">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditData.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2">{item.researcher}</td>
                        <td className="p-2">{item.date}</td>
                        <td className="p-2">{item.event}</td>
                        <td className="p-2">{item.tumorType}</td>
                        <td className="p-2">{item.patientAge}</td>
                        <td className="p-2">{item.treatment}</td>
                        <td className="p-2">{item.accuracy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AuditReport;
