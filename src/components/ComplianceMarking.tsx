
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Input } from "./ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { ArrowLeft, ChevronDown, ChevronRight, Check, X, SkipForward, RotateCcw } from "lucide-react"
import { useCompliance } from "@/hooks/useCompliance"
import { useToast } from "@/hooks/useToast"

interface ComplianceMarkingProps {
  teamId: string
  deviceId: string
  onBack: () => void
}

interface ControlMarking {
  controlId: string
  status: 'pass' | 'fail' | 'skip' | 'reset' | ''
  explanation: string
  notes: string
}

export function ComplianceMarking({ teamId, deviceId, onBack }: ComplianceMarkingProps) {
  const { controls, teams, devices } = useCompliance()
  const { toast } = useToast()
  const [selectedControlIndex, setSelectedControlIndex] = useState(0)
  const [markings, setMarkings] = useState<Record<string, ControlMarking>>({})
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [configName, setConfigName] = useState("")
  const [configComments, setConfigComments] = useState("")

  const team = teams.find(t => t._id === teamId)
  const device = devices.find(d => d._id === deviceId)
  const selectedControl = controls[selectedControlIndex]

  // Group controls by section
  const groupedControls = controls.reduce((acc, control, index) => {
    if (!acc[control.section]) {
      acc[control.section] = []
    }
    acc[control.section].push({ ...control, index })
    return acc
  }, {} as Record<string, any[]>)

  const currentMarking = markings[selectedControl?._id] || {
    controlId: selectedControl?.controlId || '',
    status: '',
    explanation: '',
    notes: ''
  }

  const handleMarkingChange = (field: keyof ControlMarking, value: string) => {
    if (!selectedControl) return

    setMarkings(prev => ({
      ...prev,
      [selectedControl._id]: {
        ...currentMarking,
        [field]: value
      }
    }))
  }

  const handleMarkCompliance = () => {
    if (!currentMarking.status || !currentMarking.explanation.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a status and provide an explanation",
        variant: "destructive"
      })
      return
    }

    console.log('Marking compliance for control:', selectedControl?.controlId)

    // Move to next control
    if (selectedControlIndex < controls.length - 1) {
      setSelectedControlIndex(selectedControlIndex + 1)
    }
  }

  const handleSaveConfiguration = async () => {
    if (!configName.trim()) {
      toast({
        title: "Missing Configuration Name",
        description: "Please provide a name for this configuration",
        variant: "destructive"
      })
      return
    }

    try {
      const controlsData = Object.entries(markings).map(([controlId, marking]) => ({
        controlId,
        ...marking
      }))

      console.log('Saving configuration:', {
        name: configName,
        teamId,
        deviceId,
        controls: controlsData,
        comments: configComments
      })

      toast({
        title: "Configuration Saved",
        description: "Your compliance configuration has been submitted for validation",
      })

      setIsSaveModalOpen(false)
      onBack()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <Check className="h-4 w-4 text-green-600" />
      case 'fail':
        return <X className="h-4 w-4 text-red-600" />
      case 'skip':
        return <SkipForward className="h-4 w-4 text-yellow-600" />
      case 'reset':
        return <RotateCcw className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Left Column: Control Navigation */}
        <Card className="glass-effect border-border/50 overflow-hidden">
          <CardHeader className="pb-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-fit mb-2"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Team: {team?.name}</p>
              <p className="text-sm text-muted-foreground">Device: {device?.name}</p>
              <p className="text-sm text-muted-foreground">Type: {device?.type}</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {Object.entries(groupedControls).map(([section, sectionControls]) => (
                <Collapsible key={section} defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-muted/50 border-b">
                    <span className="font-medium text-sm">{section}</span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {sectionControls.map((control) => {
                      const marking = markings[control._id]
                      return (
                        <button
                          key={control._id}
                          className={`w-full text-left p-3 border-b hover:bg-muted/50 transition-colors ${
                            selectedControlIndex === control.index ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => setSelectedControlIndex(control.index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(marking?.status || '')}
                              <span className="text-sm">{control.controlId} {control.title}</span>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Middle Column: Control Details */}
        <Card className="glass-effect border-border/50 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">{selectedControl?.controlId}</CardTitle>
            <p className="text-sm font-medium">{selectedControl?.title}</p>
            <Badge variant={selectedControl?.riskLevel === 'high' ? 'destructive' : selectedControl?.riskLevel === 'medium' ? 'default' : 'secondary'}>
              {selectedControl?.riskLevel} risk
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto max-h-96">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{selectedControl?.description}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Implementation Guidance</h4>
              <p className="text-sm text-muted-foreground">{selectedControl?.implementation}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">References</h4>
              <div className="space-y-1">
                {selectedControl?.references.map((ref, index) => (
                  <Badge key={index} variant="outline" className="text-xs mr-2">
                    {ref}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Compliance Marking */}
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Mark Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Status Selection</Label>
              <RadioGroup
                value={currentMarking.status}
                onValueChange={(value) => handleMarkingChange('status', value)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pass" id="pass" />
                  <Label htmlFor="pass" className="flex items-center space-x-1 cursor-pointer">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Pass</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fail" id="fail" />
                  <Label htmlFor="fail" className="flex items-center space-x-1 cursor-pointer">
                    <X className="h-4 w-4 text-red-600" />
                    <span>Fail</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="skip" id="skip" />
                  <Label htmlFor="skip" className="flex items-center space-x-1 cursor-pointer">
                    <SkipForward className="h-4 w-4 text-yellow-600" />
                    <span>Skip</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reset" id="reset" />
                  <Label htmlFor="reset" className="flex items-center space-x-1 cursor-pointer">
                    <RotateCcw className="h-4 w-4 text-gray-600" />
                    <span>Reset</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="explanation" className="text-sm font-medium">
                Explanation (Required)
              </Label>
              <Textarea
                id="explanation"
                placeholder="Explain your compliance decision..."
                value={currentMarking.explanation}
                onChange={(e) => handleMarkingChange('explanation', e.target.value)}
                className="mt-2"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {currentMarking.explanation.length}/500 characters
              </p>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional details..."
                value={currentMarking.notes}
                onChange={(e) => handleMarkingChange('notes', e.target.value)}
                className="mt-2"
                rows={2}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedControlIndex(Math.max(0, selectedControlIndex - 1))}
                disabled={selectedControlIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="flex-1">
                    Mark Compliance
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-background">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Compliance Marking</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to mark this control as {currentMarking.status}?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleMarkCompliance}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedControlIndex(Math.min(controls.length - 1, selectedControlIndex + 1))}
                disabled={selectedControlIndex === controls.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Control {selectedControlIndex + 1} of {controls.length}
            </div>
          </CardContent>
        </Card>

        {/* Save Configuration Button */}
        <div className="lg:col-span-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                Save Configuration
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-background">
              <AlertDialogHeader>
                <AlertDialogTitle>Save Configuration</AlertDialogTitle>
                <AlertDialogDescription>
                  Save your current compliance marking progress and submit for validation.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => setIsSaveModalOpen(true)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Save Configuration Modal */}
        <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
          <DialogContent className="bg-background">
            <DialogHeader>
              <DialogTitle>Save Configuration</DialogTitle>
              <DialogDescription>
                Provide details for your compliance configuration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="configName">Configuration Name (Required)</Label>
                <Input
                  id="configName"
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  placeholder="Enter configuration name..."
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="configComments">Comments/Details</Label>
                <Textarea
                  id="configComments"
                  value={configComments}
                  onChange={(e) => setConfigComments(e.target.value)}
                  placeholder="Additional information about this configuration..."
                  className="mt-2"
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveConfiguration} className="flex-1">
                  Save & Submit
                </Button>
                <Button variant="outline" onClick={() => setIsSaveModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
