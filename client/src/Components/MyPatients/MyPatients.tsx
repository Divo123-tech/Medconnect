import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Patient } from "@/utils/types";
import { getPatientsByDoctor } from "@/services/patientService";
import { useAuthStore } from "@/store/authStore";
import PatientCard from "./PatientCard";

export default function MyPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { token, user } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Reset to first page when filters change
  useState(() => {
    setCurrentPage(1);
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    setPatients(null);
    try {
      const result = await getPatientsByDoctor(token, user?.id, searchTerm);
      setPatients(result.content);
      setTotalPages(result.totalPages);
      setTotalPatients(result.totalElements);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, token, user?.id]);
  useEffect(() => {
    if (token && user?.id) {
      fetchPatients();
    }
  }, [fetchPatients, searchTerm, token, user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-blue-50 to-white">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title and Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center justify-between"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            My Patients
          </h1>
          <div className="flex items-center gap-8">
            <div className="bg-white rounded-full px-4 py-2 shadow-sm">
              <span className="text-gray-600">Total Patients: </span>
              <span className="font-bold text-teal-600">{totalPatients}</span>
            </div>
            {/* Pagination */}
            {!isLoading &&
              patients?.length != undefined &&
              patients?.length > 0 && (
                <div className="flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="border-teal-200 text-teal-700 hover:bg-teal-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (number) => {
                          // Show first page, last page, current page, and pages around current
                          const shouldShow =
                            number === 1 ||
                            number === totalPages ||
                            Math.abs(number - currentPage) <= 1;

                          // Show ellipsis for gaps
                          if (!shouldShow) {
                            // Only show one ellipsis between gaps
                            if (number === 2 || number === totalPages - 1) {
                              return (
                                <span
                                  key={number}
                                  className="px-2 text-gray-400"
                                >
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }

                          return (
                            <Button
                              key={number}
                              variant={
                                currentPage === number ? "default" : "outline"
                              }
                              size="icon"
                              onClick={() => paginate(number)}
                              className={
                                currentPage === number
                                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                                  : "border-teal-200 text-teal-700 hover:bg-teal-50"
                              }
                            >
                              {number}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="border-teal-200 text-teal-700 hover:bg-teal-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              )}
          </div>
        </motion.div>
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search patients by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Patients List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <AnimatePresence>
            {patients?.map((patient) => (
              <PatientCard
                patient={patient}
                key={patient.id}
                fetchPatients={fetchPatients}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {patients?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No patients found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
