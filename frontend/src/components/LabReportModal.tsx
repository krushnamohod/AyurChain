import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, FlaskConical, Building2, Calendar, Hash, Link } from "lucide-react";

interface LabInfo {
    name: string;
    accreditationNo?: string;
    location?: string;
}

interface LabReportInfo {
    id: number;
    testDate?: string;
    result: "PASS" | "FAIL";
    reportHash?: string;
    blockchainTxId?: string;
    lab: LabInfo;
}

interface LabReportModalProps {
    report: LabReportInfo | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * @intent LabReportModal - Displays detailed lab test report information
 * in a modal dialog when user clicks on a lab report row
 */
const LabReportModal = ({ report, open, onOpenChange }: LabReportModalProps) => {
    if (!report) return null;

    const isPassed = report.result === "PASS";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-wisdom">
                        <FlaskConical className="w-6 h-6 text-purple-600" />
                        Lab Test Report
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        Quality verification by certified laboratory
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Result Banner */}
                    <div className={`p-6 rounded-xl flex items-center gap-4 ${isPassed
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200"
                            : "bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200"
                        }`}>
                        {isPassed ? (
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        ) : (
                            <XCircle className="w-12 h-12 text-red-600" />
                        )}
                        <div>
                            <h3 className={`text-2xl font-bold ${isPassed ? "text-green-800" : "text-red-800"}`}>
                                Test {report.result}ED
                            </h3>
                            <p className={`text-sm ${isPassed ? "text-green-600" : "text-red-600"}`}>
                                {isPassed
                                    ? "This batch meets all quality standards"
                                    : "This batch did not meet quality standards"}
                            </p>
                        </div>
                    </div>

                    {/* Lab Details */}
                    <div className="grid gap-4">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 border border-purple-200">
                            <Building2 className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-purple-800">Laboratory</p>
                                <p className="text-purple-900 font-semibold mt-1">{report.lab.name}</p>
                                {report.lab.location && (
                                    <p className="text-purple-700 text-sm mt-0.5">{report.lab.location}</p>
                                )}
                            </div>
                            {report.lab.accreditationNo && (
                                <Badge variant="outline" className="text-purple-700 border-purple-300">
                                    {report.lab.accreditationNo}
                                </Badge>
                            )}
                        </div>

                        {report.testDate && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-800">Test Date</p>
                                    <p className="text-blue-900 mt-1">
                                        {new Date(report.testDate).toLocaleDateString("en-IN", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {report.reportHash && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                                <Hash className="w-5 h-5 text-gray-600 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800">Report Hash (IPFS/File)</p>
                                    <p className="text-gray-600 font-mono text-sm mt-1 break-all">
                                        {report.reportHash}
                                    </p>
                                </div>
                            </div>
                        )}

                        {report.blockchainTxId && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                                <Link className="w-5 h-5 text-indigo-600 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-indigo-800">Blockchain Transaction</p>
                                    <p className="text-indigo-600 font-mono text-xs mt-1 break-all">
                                        {report.blockchainTxId}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            🔬 Lab Verified
                        </Badge>
                        {report.blockchainTxId && (
                            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                                ⛓️ On-Chain Record
                            </Badge>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LabReportModal;
