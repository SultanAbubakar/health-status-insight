
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, User, Weight, Ruler, Target } from "lucide-react";

const Index = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [isMetric, setIsMetric] = useState(true);
  const [results, setResults] = useState<any>(null);

  const calculateBMI = () => {
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!ageNum || !heightNum || !weightNum || ageNum < 1 || heightNum < 1 || weightNum < 1) {
      return;
    }

    // Convert to metric if needed
    let heightInM = heightNum;
    let weightInKg = weightNum;

    if (!isMetric) {
      // Convert feet/inches to meters and lbs to kg
      heightInM = heightNum * 0.3048; // feet to meters
      weightInKg = weightNum * 0.453592; // lbs to kg
    } else {
      heightInM = heightNum / 100; // cm to meters
    }

    // Calculate BMI
    const bmi = weightInKg / (heightInM * heightInM);

    // Calculate Ideal Weight (D.R. Miller formula)
    const heightInCm = isMetric ? heightNum : heightNum * 30.48;
    let idealWeight;
    if (gender === 'male') {
      idealWeight = 56.2 + 1.41 * (heightInCm - 152.4);
    } else {
      idealWeight = 53.1 + 1.36 * (heightInCm - 152.4);
    }

    // Convert ideal weight to display units
    const idealWeightDisplay = isMetric ? idealWeight : idealWeight * 2.20462;

    // Calculate Body Fat % (Deurenberg formula)
    const genderFactor = gender === 'male' ? 1 : 0;
    const bodyFat = 1.20 * bmi + 0.23 * ageNum - 10.8 * genderFactor - 5.4;

    // Determine BMI category
    let category, categoryColor;
    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'bg-blue-100 text-blue-800';
    } else if (bmi < 25) {
      category = 'Normal';
      categoryColor = 'bg-green-100 text-green-800';
    } else if (bmi < 30) {
      category = 'Overweight';
      categoryColor = 'bg-yellow-100 text-yellow-800';
    } else {
      category = 'Obese';
      categoryColor = 'bg-red-100 text-red-800';
    }

    setResults({
      bmi: bmi.toFixed(1),
      idealWeight: idealWeightDisplay.toFixed(1),
      bodyFat: Math.max(0, bodyFat).toFixed(1),
      category,
      categoryColor
    });
  };

  const resetForm = () => {
    setAge('');
    setHeight('');
    setWeight('');
    setResults(null);
  };

  const getHealthTip = (category: string) => {
    switch (category) {
      case 'Underweight':
        return 'Consider consulting a healthcare provider about healthy weight gain strategies.';
      case 'Normal':
        return 'Great! Maintain your healthy lifestyle with balanced nutrition and regular exercise.';
      case 'Overweight':
        return 'Consider a balanced diet and regular physical activity to reach a healthier weight.';
      case 'Obese':
        return 'Consult with a healthcare provider for a personalized weight management plan.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">BMI Calculator</h1>
          </div>
          <p className="text-lg text-gray-600">Body Mass Index & Fat Tracker</p>
          <p className="text-sm text-gray-500 mt-2">Monitor your health with precision</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                <User className="w-5 h-5" />
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Unit Toggle */}
              <div className="flex justify-center">
                <div className="flex rounded-lg border p-1 bg-gray-100">
                  <button
                    onClick={() => setIsMetric(true)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                      isMetric 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Metric
                  </button>
                  <button
                    onClick={() => setIsMetric(false)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                      !isMetric 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Imperial
                  </button>
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
                <Select value={gender} onValueChange={(value: 'male' | 'female') => setGender(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age Input */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Height Input */}
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  Height ({isMetric ? 'cm' : 'ft'})
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder={isMetric ? "Enter height in cm" : "Enter height in feet"}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Weight Input */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Weight className="w-4 h-4" />
                  Weight ({isMetric ? 'kg' : 'lbs'})
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder={isMetric ? "Enter weight in kg" : "Enter weight in lbs"}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={calculateBMI} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Calculate BMI
                </Button>
                <Button 
                  onClick={resetForm} 
                  variant="outline"
                  className="px-6"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                  <Target className="w-5 h-5" />
                  Your Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* BMI Result */}
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <div className="text-4xl font-bold text-gray-800 mb-2">{results.bmi}</div>
                  <div className="text-sm text-gray-600 mb-3">Body Mass Index</div>
                  <Badge className={`${results.categoryColor} px-4 py-1 text-sm font-medium`}>
                    {results.category}
                  </Badge>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">{results.idealWeight}</div>
                    <div className="text-sm text-green-600">Ideal Weight ({isMetric ? 'kg' : 'lbs'})</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{results.bodyFat}%</div>
                    <div className="text-sm text-blue-600">Est. Body Fat</div>
                  </div>
                </div>

                {/* Health Tip */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="text-sm font-medium text-yellow-800 mb-1">Health Tip</div>
                  <div className="text-sm text-yellow-700">{getHealthTip(results.category)}</div>
                </div>

                {/* Disclaimer */}
                <div className="text-xs text-gray-500 text-center border-t pt-4">
                  <p>* Results are estimates. Consult healthcare professionals for medical advice.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>BMI Calculator v1.0 | Prepared by Sultan Abubakar</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
