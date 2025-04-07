export interface Complain {
  Id: number;
  Title: string;
  Body: string;
  CreatedAt: string;
}

export interface ComplainFormType{
  title:string
  setTitle:React.Dispatch<React.SetStateAction<string>>
  body:string
  setBody:React.Dispatch<React.SetStateAction<string>>
  handleSubmit:Function
  isSaving:boolean
  errorMessage:string
}