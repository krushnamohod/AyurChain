import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Leaf, MapPin, Sparkles } from "lucide-react";

interface HerbInfo {
    commonName: string;
    scientificName?: string;
    specialty?: string;
    region?: string;
    imageUrl?: string;
}

interface HerbDetailModalProps {
    herb: HerbInfo | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * @intent HerbDetailModal - Displays detailed information about an herb
 * in a modal dialog when user clicks on an herb card
 */
const HerbDetailModal = ({ herb, open, onOpenChange }: HerbDetailModalProps) => {
    if (!herb) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-wisdom">
                        <Leaf className="w-6 h-6 text-green-600" />
                        {herb.commonName}
                    </DialogTitle>
                    {herb.scientificName && (
                        <DialogDescription className="text-base italic">
                            {herb.scientificName}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Herb Image */}
                    {herb.imageUrl && (
                        <div className="w-full h-48 rounded-xl overflow-hidden bg-muted">
                            <img
                                src={herb.imageUrl}
                                alt={herb.commonName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Herb Details */}
                    <div className="grid gap-4">
                        {herb.specialty && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                                <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Specialty / Medicinal Use</p>
                                    <p className="text-amber-900 mt-1">{herb.specialty}</p>
                                </div>
                            </div>
                        )}

                        {herb.region && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                                <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-green-800">Growing Region</p>
                                    <p className="text-green-900 mt-1">{herb.region}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            🌿 Ayurvedic Herb
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            ✓ Verified Source
                        </Badge>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HerbDetailModal;
