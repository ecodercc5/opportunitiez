import dynamic from "next/dynamic";
import React, { useContext, useMemo } from "react";
// import { ChatMessage, ChatRole } from "@mondaydotcomorg/react-hooks";
import { useCallback, useEffect, useState } from "react";
import mondaySdk from "monday-sdk-js";

import { showErrorMessage } from "@/helpers/monday-actions";

import { useAiApi } from "@/hooks/useAiApi";
import useBoardGroups, {mapBoardGroupsToDropdownOptions} from "@/hooks/useBoardGroups";
import classes from "./prompt-layout.module.scss";
import TextInputWithSend from "../../components/text-input-with-send/text-input-with-send";
import SelectGroup from "@/components/select-group";
import { useSuccessMessage } from "@/hooks/useSuccessMessage";
import { Button, Flex } from "monday-ui-react-core";

import { Modes } from "@/types/layout-modes";
import {
  MondayApiResponse,
  MondayApiResponseSuccess,
  MondayApiResponseFailure,
  executeMondayApiCall,
} from "@/helpers/monday-api-helpers";
import { AppContext } from "@/components/context-provider/app-context-provider";
import SelectColumn from "../../components/select-column";
import useBoardColumns, {mapBoardColumnsToDropdownOptions} from "@/hooks/useBoardColumns";
import { PromptsApiPayloadType } from "@/hooks/useAiApi";
import { json } from "node:stream/consumers";
import { parse } from "node:path";

const monday = mondaySdk();

type Props = {
  initialInput?: string;
};

type Dropdown = {
  options: any;
  placeholder: string;
};

type DropdownSelection = {
  id: string;
  value: string;
};

type LayoutState = {
  inputs: Record<string, any>;
  setInputs: (inputs: Record<string, any>) => void;
  mode?: string;
  success?: boolean;
  action: (sessionToken: string) => {
    error: any;
    loading: boolean;
    data: Record<string, any>[];
    fetchData: (body: Record<string, any>) => Record<string, any>[];
  };
};

// TODO: rename this component
const BasePromptLayout = ({ initialInput = "" }: Props): JSX.Element => {
  // TODO: use reducer for this state
  const context = useContext(AppContext);
  const boardColumns = useBoardColumns(context);

  const [productDetails, setProductDetails] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const [hasOpportunities, setHasOpportunities] = useState(false);
  const [opportunities, setOpportunities] = useState<string[]>([]);

  const columnsForDropdown = useMemo(() => {
    return mapBoardColumnsToDropdownOptions(boardColumns) ?? [];
  }, [boardColumns]);

  const boardGroups = useBoardGroups(context);
  const boardGroupsForDropdown = useMemo(() => {
    return mapBoardGroupsToDropdownOptions(boardGroups) ?? [];
  }, [boardGroups]);

  const [mode, setMode] = useState<Modes>(Modes.request);

  const [success, setSuccess] = useState<boolean>(false);
  useSuccessMessage(success);

  const [selectedGroup, setSelectedGroup] = useState<string>();
  const [selectedColumn, setSelectedColumn] = useState<string>();

  const sessionToken = context?.sessionToken ?? "";
  const apiRoute = "/openai/prompts";

  const { loading, data, error, fetchData } = useAiApi(apiRoute, sessionToken);

  function handleColumnSelect(e: DropdownSelection) {
    setSelectedColumn(e?.value);
  }

  function handleGroupSelect(e: DropdownSelection) {
    setSelectedGroup(e?.value);
  }

  const ops = useCallback((opportunities : any) => {
    return opportunities?.map((opportunity: any, index: number) => {    
    console.log({opportunity, index});
    const text = jsonformatter(opportunity)
    console.log(text);

    return (<div style={{height: "100%", overflowY:"scroll", display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center",}}>
      <div style={{display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background: "#ffffff", borderRadius:"6px", maxWidth:"400px"}}>
        <div style={{display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background:"#4A4AFF", color:"#ffffff", borderTopRightRadius:"6px", borderTopLeftRadius:"6px", padding:"20px", paddingLeft:"20px", paddingRight:"20px"}}>
          <div style={{fontWeight:"bold", marginBottom:"8px"}}>Opportunity 1</div>
          <div style={{textAlign:"center",fontWeight:"bold"}}>{text.Opportunity1}</div>
        </div>
        <div style={{padding:"8px", paddingLeft:"16px", paddingRight:"16px"}}>
          <p><b>Problem Space: </b>{text["Problem Space1"]}</p>
          <p><b>Quotes:</b></p>
          {text.Quotes1.map((quote:any) => {
            return (
              <p>"{quote}"</p>)
          }
          )}
          <p>Found in <b>{text.Interviews1} interviews </b></p>
        </div>
      </div>

      <div style={{display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background: "#ffffff", borderRadius:"6px", maxWidth:"400px", marginTop: "32px"}}>
        <div style={{display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background:"#4A4AFF", color:"#ffffff", borderTopRightRadius:"6px", borderTopLeftRadius:"6px", padding:"20px", paddingLeft:"20px", paddingRight:"20px"}}>
          <div style={{fontWeight:"bold", marginBottom:"8px"}}>Opportunity 2</div>
          <div style={{textAlign:"center",fontWeight:"bold"}}>{text.Opportunity2}</div>
        </div>
        <div style={{padding:"8px", paddingLeft:"16px", paddingRight:"16px"}}>
          <p><b>Problem Space: </b>{text["Problem Space2"]}</p>
          <p><b>Quotes:</b></p>
          {text.Quotes2.map((quote:any) => {
            return (
              <p>"{quote}"</p>)
          }
          )}
          <p>Found in <b>{text.Interviews2} interviews </b></p>
        </div>
      </div>

      <div style={{display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background: "#ffffff", borderRadius:"6px", maxWidth:"400px", marginTop: "32px"}}>
        <div style={{display: "flex", flexDirection:"column", justifyContent:"center", alignItems:"center", background:"#4A4AFF", color:"#ffffff", borderTopRightRadius:"6px", borderTopLeftRadius:"6px", padding:"20px", paddingLeft:"20px", paddingRight:"20px"}}>
          <div style={{fontWeight:"bold", marginBottom:"8px"}}>Opportunity 3</div>
          <div style={{textAlign:"center",fontWeight:"bold"}}>{text.Opportunity3}</div>
        </div>
        <div style={{padding:"8px", paddingLeft:"16px", paddingRight:"16px"}}>
          <p><b>Problem Space: </b>{text["Problem Space3"]}</p>
          <p><b>Quotes:</b></p>
          {text.Quotes3.map((quote:any) => {
            return (
              <p>"{quote}"</p>)
          }
          )}
          <p>Found in <b>{text.Interviews3} interviews </b></p>
        </div>
      </div>
      
          
      {/* <p>Opportunity 2</p>
      <p>{text.Opportunity2}</p>
      <p><b>Problem Space: </b>{text["Problem Space2"]}</p>
      <p><b>Quotes:</b></p>
      {text.Quotes2.map((quote:any) => {
        return (
          <p>"{quote}"</p>)
      }
      )}
      <p>Found in <b>{text.Interviews2} interviews </b></p>

      <p>Opportunity 3</p>
      <p>{text.Opportunity3}</p>
      <p><b>Problem Space: </b>{text["Problem Space3"]}</p>
      <p><b>Quotes:</b></p>
      {text.Quotes3.map((quote:any) => {
        return (
          <p>"{quote}"</p>)
      }
      )}
      <p>Found in <b>{text.Interviews3} interviews </b></p> */}
      
    </div>)})
    }, [hasOpportunities]);

  function getItemsFromGroup(
    groupId: string | string[],
    boardId: number | number[]
  ) {
    return executeMondayApiCall(
      `query($boardId:[Int!], $groupId:[String!]) {boards(ids:$boardId){groups (ids:$groupId) { items { id } } } }`,
      {
        variables: { groupId, boardId },
      }
    );
  }

  function jsonformatter(properties: any) {
    console.log("-----PROPERTIES-------");
    console.log(properties);

    const newtext = properties.split("{")[1];
    console.log(newtext);
    const newproperties = "{" + newtext;

    if (!newproperties) {
        // jsonString is undefined or an empty string
        throw new Error('jsonString is undefined or empty');
    }
    
    console.log('jsonString:' + newproperties);
    
    var parsedJson;
    try {
        parsedJson = JSON.parse(newproperties);
    } catch (e) {
        // jsonString is not a valid JSON string
        throw new Error('jsonString is not a valid JSON string: ' + newproperties);
    }

    console.log(parsedJson);
    
    return parsedJson;
}


  function getTranscripts(
    groupId: string | string[],
    boardId: number | number[]
  ) {
    return executeMondayApiCall(
      `query($boardId:[Int!], $groupId:[String!]) {boards(ids:$boardId){groups (ids:$groupId) 
        { 
          items { 
            id
            column_values {
              id
              text
            } 
          } 
        } 
        } 
      }`,
      {
        variables: { groupId, boardId },
      }
    );
  }

  // function handleSendDetails = useCallback(
  //   async (input: string) => {
  //     setProductDetails(input);
  //   },
  // []);


  const handleSend = useCallback(
    async (input: string) => {
      if (!selectedGroup) {
        showErrorMessage("Select a group first", 3000);
        return { error: true };
      }
      if (!selectedColumn) {
        showErrorMessage("Select a column first", 3000);
        return { error: true };
      }

      setMode(Modes.response);
      const board = context?.iframeContext?.boardId ?? [];

      // get board items, then send items to backend, then update board with response

      const groupItems: MondayApiResponse = await getItemsFromGroup(
        selectedGroup,
        board
      );

      // console.log(groupItems);

      if (!groupItems.is_success) {
        showErrorMessage("Could not retrieve items from board.", 3000);
        return { error: true };
      }

      
      // 1. Take the transcripts and send to reduction prompt. Returns reduced transcripts.
      const business_goal=input;
      const target_user = "data analysts";
      const company_product = "predictive analytics for b2b companies";

      // console.log(groupItems.data.boards[0].groups[0].items);
      // console.log(selectedColumn);

      // Get all rows of transcripts and store in this array
      const user_feedback: MondayApiResponse = await getTranscripts(
        selectedGroup,
        board
      );

      if (!user_feedback.is_success) {
        showErrorMessage("Could not retrieve items from board.", 3000);
        return { error: true };
      }

      // console.log("TRANSCRIPTS");
      // console.log(user_feedback.data.boards[0].groups[0].items);

      const all_items = user_feedback.data.boards[0].groups[0].items;

      let transcripts = [];

      for(let i = 0; i < all_items.length; i++) {
        const item = user_feedback.data.boards[0].groups[0].items[i];
        console.log(item);
        console.log(item.column_values);

        for(let j = 0; j < item.column_values.length; j++) {
          if (item.column_values[j].id === selectedColumn){
            // console.log(item.column_values[j].text);
            transcripts[i] = item.column_values[j].text;
          }
        }
      }
      /*
      let transcripts_reduced: string[] = [];

      for(let i = 0; i < transcripts.length; i++) {
        const transcript = transcripts[i];
  
        const reduction_prompt = `Rewrite in less than 200 words. 
        ${transcript}`;

        console.log(reduction_prompt);

        const aiApiPayloadRecuction: PromptsApiPayloadType = {
          items: transcript,
          prompts: reduction_prompt,
          n: 1,
        };
  
        const aiApiResponseReduction = await fetchData(aiApiPayloadRecuction);
  
        console.log(aiApiResponseReduction);

        transcripts_reduced[i] = aiApiResponseReduction[0].result;
      }

      console.log("CHECK REDUCED TRANSCRIPTS");
      transcripts_reduced.forEach((text) => console.log(text));
      */

      // let temp_transcripts_reduced: string[] = [""];

      // 2. Take reductions and send to Identification prompt. Returns problems and quotes.

      console.log("CREATING PROBLEMS AND QUOTES");
      
      let problems_quotes: any[] = [];

      if(true) {

      for(let i = 0; i < transcripts.length; i++) {
        const transcript = transcripts[i];

        console.log(transcript);

        const identification_prompt = `You are Teresa Torres, the creator of the Solution Opportunity Tree Framework. As a consultant, you are advising a product company that builds a visual programing tool for no code builders. Their business goal is reduce database related churn. Below is a user interview with user 17. Analyze the interview and identify up to 5 problem spaces from that interview that relate to the company's product.
        Please use the Opportunity Solution Tree by Teresa Torres and the provided research framework to assist in this task.
        Your analysis should involve:
        1. Reading the transcript thoroughly to understand the user's experience, behaviors, and needs.
        2. Open coding to tag the different components of the user's feedback.
        3. Developing axial codes to link together similar tags into broader categories or themes.
        4. Conducting a thematic analysis to identify common themes or patterns related to user problems.
        5. Identifying the key problems from these themes. For each problem, provide supporting quotes from the transcript.
        6. Prioritizing the identified problems using the following criteria: frequency, severity, number of users affected, user value, business impact, strategic importance, feasibility, risk, opportunity cost, and quick wins. Provide reasoning for the prioritization.
        To provide more focus, consider the following information:
        The company's product is ${company_product}
        Please focus on accurately analyzing the interview and extracting problems that are closely related to the company's product and business goal. Provide relevant quotes from the interview to support each identified problem.
        The interview is delimited with triple backticks.
        Format your response as a JSON object using the following keys:
        Problem1: User problem framed in an actionable and concise manner
        Quote1: A quote from the interview
        Do it with up to 5 problems, prioritized based on the criteria in the guidelines.
        INTERVIEW:
        ${transcript}
        `;

        console.log(identification_prompt);

        const aiApiPayloadIdentification: PromptsApiPayloadType = {
          items: transcript,
          prompts: identification_prompt,
          n: 1,
        };

        const aiApiResponseIdentification = await fetchData(aiApiPayloadIdentification);

        console.log(aiApiResponseIdentification);

        problems_quotes[i] = aiApiResponseIdentification[0].result;
      }
    }

      // 3. Take problems and quotes and send to opportunities prompt. Returns opportunities.
      console.log("CREATING OPPORTUNITIES");
      // const temp_problems_quotes = [
      //   `Problem: "Time conflicts and synchronous learning." Quote: "learning is synchronous → can't make the meeting"`,
      //   `Problem: "Difficulty in implementing change" Quote: "hard to change club → slow changes, hard to move from idea to action"`,
      // ];
      // var problems_quotes_as_string = "";
      // temp_problems_quotes.forEach((problem) => {
      //   problems_quotes_as_string += (problem + "\n");
      // })
      // console.log(problems_quotes_as_string);
      const temp_problems_quotes: string[] = [
        `{
          "Problem1": "Finding design partners to cooperate in building the site selection tool",
          "Quote1": "potentially looking for design partners will be willing to cooperate with us and, you know, help us getting together the store",
        
          "Problem2": "Reducing the time taken to launch the site selection tool",
          "Quote2": "we hopefully launch by the beginning of early Nick the next day or Q1",
        
          "Problem3": "Getting feedback from clients while developing the tool",
          "Quote3": "we are interviewing selected the clients",
        
          "Problem4": "Finding suitable clients to interview for the development process",
          "Quote4": "we are interviewing selected the clients",
        
          "Problem5": "Incorporating client feedback into the site selection tool",
          "Quote5": "So, you know, we are interviewing selected the clients and also potentially looking for design partners will be willing to cooperate with us and, you know, help us getting together the store"
        }`
      ]

      let temp_opportunities: string[] = [];

      if(true) {
      let problem_quote = "";
      for(let i = 0; i < problems_quotes.length; i++) {
        console.log("-------PROBLEM QUOTE-------- " + i);
        console.log(problem_quote);
        problem_quote += problems_quotes[i];
      }
      console.log("-------ALL TOGETHER PROBLEM QUOTE--------");
      console.log(problem_quote);
        const opportunities_prompt = `
        You are a highly skilled AI model, with a deep understanding of the Solution Opportunity Tree framework by Teresa Torres. 
        Your task is to analyze a set of problems and corresponding quotes identified from multiple user interviews for a company that builds a ${company_product}. 
        The company's business goal is ${business_goal} and their target user is ${target_user}.
        Identify recurring problem spaces, where a 'problem space' refers to a shared area of difficulty or challenge noted by multiple users. 
        Convert these problem spaces into 'opportunities', which are actionable ideas that could address the problem spaces and enhance the company product.
        When prioritizing these opportunities, consider their relevance and potential to improve the business goal, their frequency of occurrence in the problems list, and their perceived significance from the user's perspective.
        Please structure your response in a JSON format. Here's an example of the required format: 
        {
          'Opportunity1': '...',  'Problem Space1': '...', 'Quotes1': [...], 'Interviews1': ...,
          'Opportunity2': '...', 'Problem Space2': '...', 'Quotes2': [...], 'Interviews2': ...,
          'Opportunity3': '...', 'Problem Space3': '...', 'Quotes3': [...], 'Interviews3': ...
        }
        Where each 'Opportunity' key corresponds to a proposed opportunity, each 'Problem Space' key refers to the problem space it addresses, 'Quotes' keys include direct quotes from the interviews that highlight the problem space, and 'Interviews' keys indicate how many interviews mentioned the problem space. 
        Return the top three opportunities.
        The problems and corresponding quotes are delimited with triple backticks. 
        Start by analyzing the given data, after identifying the repeated problem spaces turn them into opportunities, then prioritize them based on the parameters that you were given, return the top three opportunities in the format you were given.
  
        These are the problems and quotes: ${problem_quote}
        `;

        console.log(opportunities_prompt);

        const aiApiPayloadOpportunities: PromptsApiPayloadType = {
          items: transcripts,
          prompts: opportunities_prompt,
          n: 1,
        };

        const aiApiResponseOpportunities = await fetchData(aiApiPayloadOpportunities);

        console.log(aiApiResponseOpportunities);

        temp_opportunities[0] = aiApiResponseOpportunities[0].result;
    }

      setSuccess(true);
      setHasOpportunities(true);
      setOpportunities(temp_opportunities);

      // const aiApiPayload: PromptsApiPayloadType = {
      //   items: groupItems.data.boards[0].groups[0].items,
      //   prompts: opportunities_prompt,
      //   n: groupItems.data.boards[0].groups[0].items.length,
      // };

      // const aiApiResponse = await fetchData(aiApiPayload);

      /*
      const aiApiResponse: any[] = [];

      console.log(aiApiResponse);

      if (aiApiResponse.length === 0 || !aiApiResponse.length) {
        showErrorMessage("Selected group has no items.", 3000);
        return [];
      } else {
        // setOpportunities(aiApiResponse);
        // let itemUpdates = aiApiResponse.map(
        //   async (result: Record<string, any>) => {
        //     return await executeMondayApiCall(
        //       `mutation ($column:String!,$boardId:Int!, $itemId:Int!, $value:String!) {change_simple_column_value (column_id:$column, board_id:$boardId, item_id:$itemId, value:$value) {id }}`,
        //       {
        //         variables: {
        //           column: selectedColumn,
        //           boardId: board,
        //           itemId: parseInt(result.item.id),
        //           value: result.result,
        //         },
        //       }
        //     );
        //   }
        // );
        // console.log(itemUpdates);
        // let success = await Promise.all(itemUpdates);
        // if (success) {
          console.log("promises:", success);
          setMode(Modes.request);
          setSuccess(true);
          setHasOpportunities(true);
          setOpportunities(aiApiResponse);

          // console.log("OPPORTUNITIES");
          // console.log(hasOpportunities);
          // hasOpportunities && opportunities.map((opportunity:any) => console.log(opportunity));

          setTimeout(() => setSuccess(false), 5000);
        // }
      }
      */
    },
    [fetchData, context, selectedColumn, selectedGroup]
  );

  console.log(productDetails == "" || targetAudience == "");
  
  if(productDetails == "") {
      return (
        <div className={classes.main} style={{height: "100%", overflowY:"scroll", paddingTop:"20px"}}>
          <div style={{color:"#4A4AFF", marginBottom: "24px", flexDirection:"column", alignItems:"center", justifyContent:"center", fontSize:"20px"}}>
            <div style={{fontWeight: "bold"}}>Identify your business opportunities</div>
            <div style={{fontWeight: "bold"}}>in minutes instead of days!</div>
          </div>
          <div style={{color:"#4A4AFF", fontWeight: "bold"}}>What is your product?</div>
          <TextInputWithSend
            mode={mode}
            setMode={setMode}
            error={error}
            initialInputValue={initialInput}
            loading={loading || mode == Modes.response}
            success={success}
            onSend={(e) => {
              setProductDetails(e)
              setSuccess(true)
            }}
            placeholder="ie. A cloud based task management platform"
            hasButton={true}
            buttonText="Next"
          />
          <div style={{height:"124px"}}/>
          {/* <div style={{color:"#4A4AFF", fontWeight: "bold", marginTop: "14px"}}>Who is your target audience?</div>
          <TextInputWithSend
            mode={mode}
            setMode={setMode}
            error={error}
            initialInputValue={initialInput}
            loading={loading || mode == Modes.response}
            success={success}
            onSend={(e) => setTargetAudience(e)}
            placeholder="Product Managers"
            hasButton={true}
            buttonText="Continue"
          /> */}
        </div>
      )
    } else if (productDetails && targetAudience == ""){
      return (
          <div className={classes.main} style={{height: "100%", overflowY:"scroll", paddingTop:"20px"}}>
            <div style={{color:"#4A4AFF", marginBottom: "24px", flexDirection:"column", alignItems:"center", justifyContent:"center", fontSize:"20px"}}>
              <div style={{fontWeight: "bold"}}>Identify your business opportunities</div>
              <div style={{fontWeight: "bold"}}>in minutes instead of days!</div>
            </div>
            <div style={{color:"#4A4AFF", fontWeight: "bold", marginTop: "14px"}}>Who is your target audience?</div>
            <TextInputWithSend
              mode={mode}
              setMode={setMode}
              error={error}
              initialInputValue={""}
              loading={loading || mode == Modes.response}
              success={success}
              onSend={(e) => setTargetAudience(e)}
              placeholder="Product Managers"
              hasButton={true}
              buttonText="Next"
            />
            <div style={{height:"124px"}}/>
          </div>
      )
    }else {
      return (
        (!hasOpportunities ?
        <div className={classes.main} style={{height: "100%", overflowY:"scroll"}}>  
        <div style={{color:"#4A4AFF", fontWeight: "bold", marginTop: "14px", marginBottom: "8px"}}>Import User Interviews</div>
          <div className={classes.dropdownContainer}>
            <SelectColumn
              className={classes.columnsDropdown}
              columns={columnsForDropdown}
              onChange={handleColumnSelect}
            />
            <SelectGroup
              className={classes.groupsDropdown}
              groups={boardGroupsForDropdown}
              onChange={handleGroupSelect}
            />
          </div>
          <div style={{color:"#4A4AFF", fontWeight: "bold", marginTop: "20px"}}>What is your business goal?</div>
          <TextInputWithSend
            mode={mode}
            setMode={setMode}
            error={error}
            initialInputValue={initialInput}
            loading={loading || mode == Modes.response}
            success={success}
            onSend={handleSend}
            placeholder="Write business goal..."
            hasButton={true}
            buttonText="Generate Opportunities"
          />
          {!loading && <div style={{height:"88px"}}/>}
          {loading && <div style={{marginTop: "40px", textAlign:"center", paddingBottom: "12px", color:"#4A4AFF"}}>This will take between 30-60 seconds, but hey, at least you don't need to do it yourself!</div>}
          {/* <Button style={{marginTop: "8px"}}>Generate Opportunities</Button> */}
        </div> :
        <div className={classes.main} style={{height: "100%", overflowY:"scroll"}}>
          {ops(opportunities)}
        </div>
        )
      );
    }
};

export default BasePromptLayout;
