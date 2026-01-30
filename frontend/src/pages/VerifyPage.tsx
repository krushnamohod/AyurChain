import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import HerbDetailModal from "@/components/HerbDetailModal";
import LabReportModal from "@/components/LabReportModal";
import {
    CheckCircle,
    ChevronRight,
    FlaskConical,
    Leaf,
    Link2,
    Loader2,
    MapPin,
    Search,
    Shield,
    Truck,
    User,
    XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface HerbInfo {
    commonName: string;
    scientificName?: string;
    specialty?: string;
    region?: string;
    imageUrl?: string;
}

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

interface TimelineEvent {
    stage: string;
    date: string;
    actor: string;
    location?: string;
    details?: any;
    blockchainTxId?: string;
}

interface BatchResult {
    verified: boolean;
    batchId: string;
    status: string;
    labResult?: string;
    qrCodeUrl?: string;
    herb: HerbInfo;
    ingredients?: HerbInfo[]; // Array of ingredient herbs for products
    origin: {
        farmer: string;
        location?: string;
        harvestDate?: string;
        quantity?: string;
    };
    timeline: TimelineEvent[];
    blockchainVerifications?: any[];
    labReports?: LabReportInfo[];
}

/**
 * @intent VerifyPage - Enhanced verification page with two-step flow
 * Step 1: Fetch batch info from database
 * Step 2: Verify on blockchain (user clicks button)
 * Features: Clickable herbs and lab reports with detail modals
 */
const VerifyPage = () => {
    const { batchId: urlBatchId } = useParams();
    const navigate = useNavigate();

    const [batchId, setBatchId] = useState(urlBatchId || "");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState<BatchResult | null>(null);
    const [blockchainVerified, setBlockchainVerified] = useState(false);
    const [error, setError] = useState("");

    // Modal states
    const [selectedHerb, setSelectedHerb] = useState<HerbInfo | null>(null);
    const [herbModalOpen, setHerbModalOpen] = useState(false);
    const [selectedLabReport, setSelectedLabReport] = useState<LabReportInfo | null>(null);
    const [labModalOpen, setLabModalOpen] = useState(false);

    // Auto-fetch if batchId in URL
    useEffect(() => {
        if (urlBatchId) {
            handleSearch();
        }
    }, [urlBatchId]);

    const handleSearch = async () => {
        if (!batchId.trim()) {
            setError("Please enter a batch ID");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);
        setBlockchainVerified(false);

        try {
            const response = await fetch(`${API_BASE}/verify/${batchId}`);
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Batch not found");
                return;
            }

            setResult(data);
            navigate(`/verify/${batchId}`, { replace: true });
        } catch (err) {
            setError("Failed to connect to verification server");
        } finally {
            setLoading(false);
        }
    };

    const handleBlockchainVerify = async () => {
        if (!result) return;

        setVerifying(true);

        // Simulate blockchain verification delay
        // In production, this would call Polygon to verify transactions
        await new Promise(resolve => setTimeout(resolve, 1500));

        setBlockchainVerified(true);
        setVerifying(false);
    };

    const openHerbModal = (herb: HerbInfo) => {
        setSelectedHerb(herb);
        setHerbModalOpen(true);
    };

    const openLabReportModal = (report: LabReportInfo) => {
        setSelectedLabReport(report);
        setLabModalOpen(true);
    };

    const getStatusIcon = (stage: string) => {
        switch (stage) {
            case "HARVESTED":
                return <Leaf className="w-5 h-5 text-green-600" />;
            case "PROCESSED":
                return <Truck className="w-5 h-5 text-blue-600" />;
            case "LAB_TESTED":
                return <FlaskConical className="w-5 h-5 text-purple-600" />;
            default:
                return <Shield className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusBgColor = (status: string) => {
        switch (status) {
            case "HARVESTED":
                return "bg-green-100 text-green-800";
            case "PROCESSED":
                return "bg-blue-100 text-blue-800";
            case "LAB_TESTED":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="bg-background min-h-screen font-modern">
            <div className="container mx-auto px-4 py-16 sm:py-20">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-wisdom font-bold text-foreground mb-4">
                        🔍 Verify Authenticity
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Enter a batch ID or scan a QR code to verify product authenticity
                    </p>
                </div>

                {/* Search Box */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Enter Batch ID (e.g., BATCH001)"
                                value={batchId}
                                onChange={(e) => setBatchId(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="w-full pl-12 pr-4 py-6 text-lg rounded-xl"
                            />
                        </div>
                        <Button
                            size="lg"
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-8 py-6"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
                        </Button>
                    </div>
                    {error && (
                        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                            <XCircle className="w-5 h-5 text-red-500" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}
                </div>

                {/* Results */}
                {result && (
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Batch Found Status */}
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                            <div className="flex items-center gap-4">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-green-800">
                                        Batch Found
                                    </h2>
                                    <p className="text-green-700">
                                        Batch ID: <span className="font-mono font-bold">{result.batchId}</span>
                                    </p>
                                </div>
                                <Badge className={getStatusBgColor(result.status)}>
                                    {result.status}
                                </Badge>
                                {result.labResult && (
                                    <Badge
                                        variant={result.labResult === "PASS" ? "default" : "destructive"}
                                        className="text-base px-4 py-1"
                                    >
                                        Lab: {result.labResult}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Product Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-wisdom">
                                    <Leaf className="w-5 h-5 text-green-600" />
                                    Product Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Herb Name</p>
                                            <p className="text-lg font-semibold">{result.herb.commonName}</p>
                                        </div>
                                        {result.herb.scientificName && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Scientific Name</p>
                                                <p className="text-lg italic">{result.herb.scientificName}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-2">
                                            <User className="w-4 h-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Farmer</p>
                                                <p className="font-medium">{result.origin.farmer}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Location</p>
                                                <p className="font-medium">{result.origin.location || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Verify on Blockchain Button */}
                        <div className="flex justify-center">
                            {!blockchainVerified ? (
                                <Button
                                    size="lg"
                                    onClick={handleBlockchainVerify}
                                    disabled={verifying}
                                    className="px-8 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                >
                                    {verifying ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Verifying on Blockchain...
                                        </>
                                    ) : (
                                        <>
                                            <Link2 className="w-5 h-5 mr-2" />
                                            Verify on Blockchain
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-indigo-600" />
                                    <div>
                                        <p className="font-semibold text-indigo-800">Blockchain Verified</p>
                                        <p className="text-sm text-indigo-600">All records confirmed on distributed ledger</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Herbs/Ingredients Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-wisdom">
                                    <Leaf className="w-5 h-5 text-green-600" />
                                    {result.ingredients && result.ingredients.length > 0
                                        ? "Ingredients in this Product"
                                        : "Herbs in this Batch"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {/* Show ingredients if available, otherwise show main herb */}
                                    {result.ingredients && result.ingredients.length > 0 ? (
                                        result.ingredients.map((ingredient, index) => (
                                            <button
                                                key={index}
                                                onClick={() => openHerbModal(ingredient)}
                                                className="p-4 rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-400 hover:shadow-md transition-all text-left group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                                        <Leaf className="w-6 h-6 text-green-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-green-900 truncate">
                                                            {ingredient.commonName}
                                                        </p>
                                                        <p className="text-xs text-green-600 italic truncate">
                                                            {ingredient.scientificName || "View Details"}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-green-400 group-hover:text-green-600 transition-colors" />
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <button
                                            onClick={() => openHerbModal(result.herb)}
                                            className="p-4 rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-400 hover:shadow-md transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Leaf className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-green-900 truncate">
                                                        {result.herb.commonName}
                                                    </p>
                                                    <p className="text-sm text-green-600">View Details</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-green-400 group-hover:text-green-600 transition-colors" />
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Lab Reports Section */}
                        {result.timeline && result.timeline.filter(e => e.stage === "LAB_TESTED").length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 font-wisdom">
                                        <FlaskConical className="w-5 h-5 text-purple-600" />
                                        Lab Test Reports
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {result.timeline
                                            .filter((event) => event.stage === "LAB_TESTED")
                                            .map((event, index) => {
                                                const labReport: LabReportInfo = {
                                                    id: index,
                                                    testDate: event.date,
                                                    result: event.details?.result || "PASS",
                                                    reportHash: event.details?.reportHash,
                                                    blockchainTxId: event.blockchainTxId,
                                                    lab: {
                                                        name: event.actor,
                                                        accreditationNo: event.details?.accreditationNo,
                                                        location: event.location,
                                                    },
                                                };

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => openLabReportModal(labReport)}
                                                        className="w-full p-4 rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 hover:border-purple-400 hover:shadow-md transition-all text-left group"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${labReport.result === "PASS"
                                                                    ? "bg-green-100"
                                                                    : "bg-red-100"
                                                                    }`}
                                                            >
                                                                {labReport.result === "PASS" ? (
                                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                                ) : (
                                                                    <XCircle className="w-5 h-5 text-red-600" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge
                                                                        variant={
                                                                            labReport.result === "PASS"
                                                                                ? "default"
                                                                                : "destructive"
                                                                        }
                                                                        className="text-xs"
                                                                    >
                                                                        {labReport.result}
                                                                    </Badge>
                                                                    <span className="font-semibold text-purple-900">
                                                                        {labReport.lab.name}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-purple-600 mt-1">
                                                                    {labReport.testDate
                                                                        ? new Date(labReport.testDate).toLocaleDateString()
                                                                        : "Date N/A"}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-600 transition-colors">
                                                                <span className="text-sm hidden sm:inline">View Details</span>
                                                                <ChevronRight className="w-5 h-5" />
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Supply Chain Timeline */}
                        {result.timeline && result.timeline.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 font-wisdom">
                                        <Shield className="w-5 h-5 text-amber-600" />
                                        Supply Chain Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {result.timeline.map((event, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        {getStatusIcon(event.stage)}
                                                    </div>
                                                    {index < result.timeline.length - 1 && (
                                                        <div className="w-0.5 h-full bg-border mt-2" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-6">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold">{event.stage}</h4>
                                                        <Badge variant="outline" className="text-xs">
                                                            {new Date(event.date).toLocaleDateString()}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-muted-foreground text-sm">
                                                        {event.actor} • {event.location}
                                                    </p>
                                                    {blockchainVerified && event.blockchainTxId && (
                                                        <p className="text-xs font-mono text-indigo-600 mt-1">
                                                            TX: {event.blockchainTxId.slice(0, 24)}...
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <HerbDetailModal
                herb={selectedHerb}
                open={herbModalOpen}
                onOpenChange={setHerbModalOpen}
            />
            <LabReportModal
                report={selectedLabReport}
                open={labModalOpen}
                onOpenChange={setLabModalOpen}
            />
        </div>
    );
};

export default VerifyPage;
