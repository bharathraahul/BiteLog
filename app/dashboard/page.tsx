"use client"

import { useState } from "react"

export default function Dashboard() {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selected)
  }

  async function handleSubmit() {
    if (!file) return

    setLoading(true)

    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12 min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Log a Meal
        </h1>
        <p className="text-lg text-gray-600">
          Upload a photo of your food to get nutrition information
        </p>
      </header>
      
      <section className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
        <div className="text-5xl mb-6 text-gray-400">📸</div>
        <p className="text-lg text-gray-700 mb-4">Click to upload or drag and drop</p>
        <p className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF</p>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden"
          onChange={handleFileChange} 
        />
        {preview && (
          <div className="mt-8">
            <img 
              src={preview} 
              alt="Food preview" 
              className="rounded-lg shadow-lg max-w-full"
            />
          </div>
        )}
        {file && (
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 hover:-translate-y-1 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                Analyzing...
                <svg className="ml-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              </>
            ) : "Analyze Food"}
          </button>
        )}
      </section>
      
      {result && (
        <div className="mt-10 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 capitalize">
            {result.nutrition?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
              <p className="text-sm text-gray-500 text-uppercase tracking-wider mb-2">Calories</p>
              <p className="text-2xl font-bold text-gray-800">{result.nutrition?.calories}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
              <p className="text-sm text-gray-500 text-uppercase tracking-wider mb-2">Protein</p>
              <p className="text-2xl font-bold text-gray-800">{result.nutrition?.protein}g</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
              <p className="text-sm text-gray-500 text-uppercase tracking-wider mb-2">Carbs</p>
              <p className="text-2xl font-bold text-gray-800">{result.nutrition?.carbs}g</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
              <p className="text-sm text-gray-500 text-uppercase tracking-wider mb-2">Fat</p>
              <p className="text-2xl font-bold text-gray-800">{result.nutrition?.fat}g</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}