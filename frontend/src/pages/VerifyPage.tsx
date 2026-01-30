import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, FlaskConical, Leaf, Loader2, Search, Shield, Truck, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * @intent VerifyPage - Allows users to verify batch authenticity via GunDB
 * @param batchId - Optional batch ID from URL params
 */
const VerifyPage = () => {
    const { batchId: urlBatchId } = useParams();
    const navigate = useNavigate();

    const [batchId, setBatchId] = useState(urlBatchId || "");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const handleVerify = async () => {
        if (!batchId.trim()) {
            setError("Please enter a batch ID");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch(`${API_BASE}/verify/${batchId}`);
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Verification failed");
                return;
            }

            setResult(data);
            // Update URL without reload
            navigate(`/verify/${batchId}`, { replace: true });
        } catch (err) {
            setError("Failed to connect to verification server");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (stage: string) => {
        switch (stage) {
            case "HARVESTED": return <Leaf className="w-5 h-5 text-green-600" />;
            case "PROCESSED": return <Truck className="w-5 h-5 text-blue-600" />;
            case "LAB_TESTED": return <FlaskConical className="w-5 h-5 text-purple-600" />;
            default: return <Shield className="w-5 h-5 text-gray-600" />;
        }
    };

    return (
        <div className="bg-background min-h-screen font-modern">
            <div className="container mx-auto px-4 py-16 sm:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-7xl font-wisdom font-bold text-foreground mb-4">
                        Verify Authenticity
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Enter a batch ID to verify its authenticity on the blockchain
                    </p>
                </div>

                {/* Search Box */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Enter Batch ID (e.g., BATCH001)"
                                value={batchId}
                                onChange={(e) => setBatchId(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                                className="w-full pl-12 pr-4 py-6 text-lg rounded-xl"
                            />
                        </div>
                        <Button
                            size="lg"
                            onClick={handleVerify}
                            disabled={loading}
                            className="px-8"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
                        </Button>
                    </div>
                    {error && (
                        <p className="text-red-500 mt-4 text-center">{error}</p>
                    )}
                </div>

                {/* Results */}
                {result && (
                    <div className="max-w-4xl mx-auto">
                        {/* Verification Status */}
                        <div className={`p-6 rounded-2xl mb-8 ${result.verified ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
                            <div className="flex items-center gap-4">
                                {result.verified ? (
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                ) : (
                                    <XCircle className="w-12 h-12 text-red-600" />
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">
                                        {result.verified ? "Verified Authentic" : "Verification Failed"}
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Batch ID: <span className="font-mono font-bold">{result.batchId}</span>
                                    </p>
                                </div>
                                {result.labResult && (
                                    <Badge variant={result.labResult === "PASS" ? "default" : "destructive"} className="ml-auto text-lg px-4 py-2">
                                        Lab: {result.labResult}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Herb Info */}
                        {result.herb && (
                            <div className="bg-card rounded-2xl p-6 mb-8 shadow-sm">
                                <h3 className="text-xl font-wisdom font-bold mb-4">Product Information</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-muted-foreground">Herb Name</p>
                                        <p className="font-semibold text-lg">{result.herb.commonName}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Scientific Name</p>
                                        <p className="font-semibold text-lg italic">{result.herb.scientificName || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Farmer</p>
                                        <p className="font-semibold text-lg">{result.origin?.farmer || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Harvest Location</p>
                                        <p className="font-semibold text-lg">{result.origin?.location || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        {result.timeline && result.timeline.length > 0 && (
                            <div className="bg-card rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xl font-wisdom font-bold mb-6">Supply Chain Timeline</h3>
                                <div className="space-y-6">
                                    {result.timeline.map((event: any, index: number) => (
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
                                                {event.blockchainTxId && (
                                                    <p className="text-xs font-mono text-tech-blue mt-1">
                                                        TX: {event.blockchainTxId.slice(0, 24)}...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyPage;
